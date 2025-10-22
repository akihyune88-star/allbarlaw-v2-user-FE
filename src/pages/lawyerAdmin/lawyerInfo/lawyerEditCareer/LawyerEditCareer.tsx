import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useLawyerCareer, useUpdateLawyerCareer } from '@/hooks/queries/useLawyer'
import { LawyerCareerUpdateRequest } from '@/types/lawyerTypes'
import styles from './lawyerEditCareer.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { getLawyerIdFromToken } from '@/utils/tokenUtils'
import { LOCAL } from '@/constants/local'
import { useFormChange } from '@/contexts/FormChangeContext'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/toast/Toast'

interface CareerItem {
  id: string
  lawyerCareerCategoryName: string
  lawyerCareerContent: string
  lawyerCareerContentArray: string[] // 각 줄을 배열로 관리
  lawyerCareerDisplayOrder: number
}

interface SortableItemProps {
  career: CareerItem
  isSelected: boolean
  isEditing: boolean
  editingCategoryName: string
  onCategoryClick: (_career: CareerItem) => void
  onCategoryNameSave: (_id: string) => void
  onCategoryNameChange: (_value: string) => void
  onCategoryEditCancel: () => void
  onDelete: (_id: string) => void
  onClick: (_career: CareerItem) => void
}

const SortableItem = ({
  career,
  isSelected,
  isEditing,
  editingCategoryName,
  onCategoryClick,
  onCategoryNameSave,
  onCategoryNameChange,
  onCategoryEditCancel,
  onDelete,
  onClick,
}: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: career.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.categoryCard}  ${isDragging ? styles.dragging : ''}`}
      onClick={() => onClick(career)}
    >
      <div
        className={`${styles.categoryCard__content} ${isSelected ? styles.selected : ''} ${
          isEditing ? styles.editing : ''
        }`}
      >
        {isEditing ? (
          <input
            type='text'
            value={editingCategoryName}
            onChange={e => onCategoryNameChange(e.target.value)}
            onBlur={() => onCategoryNameSave(career.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') onCategoryNameSave(career.id)
              if (e.key === 'Escape') onCategoryEditCancel()
            }}
            onClick={e => e.stopPropagation()}
            autoFocus
            className={styles.categoryInput}
          />
        ) : (
          <span
            className={styles.categoryName}
            title='클릭하여 편집'
            onClick={e => {
              e.stopPropagation()
              onCategoryClick(career)
            }}
          >
            {career.lawyerCareerCategoryName || '\u00A0'}
          </span>
        )}
        <div className={styles.categoryActions}>
          <button
            className={styles.deleteButton}
            onClick={e => {
              e.stopPropagation()
              onDelete(career.id)
            }}
            aria-label='삭제'
          >
            ×
          </button>
        </div>
      </div>
      <SvgIcon {...attributes} {...listeners} name='drag' className={styles.dragHandle} aria-label='드래그' />
    </div>
  )
}

export interface LawyerEditCareerRef {
  getFormData: () => LawyerCareerUpdateRequest
}

const LawyerEditCareer = forwardRef<LawyerEditCareerRef, {}>((_props, ref) => {
  const navigate = useNavigate()
  const lawyerId = getLawyerIdFromToken(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN) || '')
  const { data: careerDataFromAPI, isLoading } = useLawyerCareer(Number(lawyerId))
  const { setHasUnsavedChanges } = useFormChange()
  const { toasts, removeToast, success, error } = useToast()

  const [careerData, setCareerData] = useState<CareerItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [originalData, setOriginalData] = useState<CareerItem[]>([])
  const [selectedCareer, setSelectedCareer] = useState<CareerItem | null>(null)
  const [contentArray, setContentArray] = useState<string[]>(['']) // 배열로 관리
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // API 데이터로 초기화
  useEffect(() => {
    if (careerDataFromAPI && !isInitialized) {
      // careerDataFromAPI.lawyerCareers로 접근해야 합니다
      const dataArray = careerDataFromAPI.lawyerCareers || []

      if (dataArray.length > 0) {
        const initialData = dataArray.map((item: any, index: number) => ({
          id: `api-${item.lawyerCareerId || index}`,
          lawyerCareerCategoryName: item.lawyerCareerCategoryName || '',
          lawyerCareerContent: item.lawyerCareerContent || '',
          lawyerCareerContentArray: item.lawyerCareerContent
            ? item.lawyerCareerContent.split('\n').filter((line: string) => line.trim())
            : [''],
          lawyerCareerDisplayOrder: item.lawyerCareerDisplayOrder || index + 1,
        }))
        setCareerData(initialData)
        setOriginalData(initialData)
      } else {
        setCareerData([])
        setOriginalData([])
      }
      setIsInitialized(true)
    } else if (!careerDataFromAPI && !isLoading && !isInitialized) {
      setCareerData([])
      setOriginalData([])
      setIsInitialized(true)
    }
  }, [careerDataFromAPI, isLoading, isInitialized])

  // 카테고리 선택
  const handleCareerClick = (career: CareerItem) => {
    setSelectedCareer(career)
    setContentArray(career.lawyerCareerContentArray || [''])
  }

  // 카테고리 이름 클릭 핸들러
  const handleCategoryClick = (career: CareerItem) => {
    // 이미 선택된 항목을 다시 클릭한 경우 → 편집 모드
    if (selectedCareer?.id === career.id) {
      setEditingCategoryId(career.id)
      setEditingCategoryName(career.lawyerCareerCategoryName)
    } else {
      // 처음 클릭 → 선택만 (우측 패널 표시)
      setSelectedCareer(career)
      setContentArray(career.lawyerCareerContentArray || [''])
    }
  }

  // 데이터 비교 함수
  const compareData = useCallback((data1: CareerItem[], data2: CareerItem[]) => {
    if (data1.length !== data2.length) return false

    return data1.every((item1, index) => {
      const item2 = data2[index]
      return (
        item1.lawyerCareerCategoryName === item2.lawyerCareerCategoryName &&
        item1.lawyerCareerContent === item2.lawyerCareerContent &&
        item1.lawyerCareerDisplayOrder === item2.lawyerCareerDisplayOrder &&
        JSON.stringify(item1.lawyerCareerContentArray) === JSON.stringify(item2.lawyerCareerContentArray)
      )
    })
  }, [])

  // 변경사항 감지
  useEffect(() => {
    const hasChanges = !compareData(careerData, originalData)
    setHasUnsavedChanges(hasChanges)
  }, [careerData, originalData, compareData, setHasUnsavedChanges])

  // 카테고리 이름 저장
  const handleCategoryNameSave = (id: string) => {
    setCareerData(prev =>
      prev.map(item => (item.id === id ? { ...item, lawyerCareerCategoryName: editingCategoryName } : item))
    )
    if (selectedCareer?.id === id) {
      setSelectedCareer(prev => (prev ? { ...prev, lawyerCareerCategoryName: editingCategoryName } : null))
    }
    setEditingCategoryId(null)
    setEditingCategoryName('')
  }

  // 카테고리 추가
  const handleAdd = () => {
    const newItem: CareerItem = {
      id: Date.now().toString(),
      lawyerCareerCategoryName: '새 카테고리',
      lawyerCareerContent: '',
      lawyerCareerContentArray: [''],
      lawyerCareerDisplayOrder: careerData.length + 1,
    }
    setCareerData(prev => [...prev, newItem])
    setSelectedCareer(newItem)
    setContentArray([''])
  }

  // 카테고리 삭제
  const handleDelete = (id: string) => {
    setCareerData(prev => {
      const filtered = prev.filter(item => item.id !== id)
      return filtered.map((item, index) => ({
        ...item,
        lawyerCareerDisplayOrder: index + 1,
      }))
    })

    if (selectedCareer?.id === id) {
      setSelectedCareer(null)
      setContentArray([''])
    }
  }

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCareerData(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        const reorderedItems = arrayMove(items, oldIndex, newIndex)

        return reorderedItems.map((item, index) => ({
          ...item,
          lawyerCareerDisplayOrder: index + 1,
        }))
      })
    }
  }

  // 개별 인풋 값 변경 핸들러
  const handleContentItemChange = (index: number, value: string) => {
    const newArray = [...contentArray]
    newArray[index] = value
    setContentArray(newArray)

    // 실시간으로 careerData 업데이트
    if (selectedCareer) {
      const contentString = newArray.filter(item => item.trim()).join('\n')
      setCareerData(prev =>
        prev.map(item =>
          item.id === selectedCareer.id
            ? { ...item, lawyerCareerContent: contentString, lawyerCareerContentArray: newArray }
            : item
        )
      )
      setSelectedCareer({
        ...selectedCareer,
        lawyerCareerContent: contentString,
        lawyerCareerContentArray: newArray,
      })
    }
  }

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // 현재 인덱스 다음에 새 입력 필드 추가
      const newArray = [...contentArray]
      newArray.splice(index + 1, 0, '')
      setContentArray(newArray)

      // 다음 입력 필드로 포커스 이동 (setTimeout으로 DOM 업데이트 대기)
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.${styles.contentInput}`)
        if (inputs[index + 1]) {
          ;(inputs[index + 1] as HTMLInputElement).focus()
        }
      }, 0)
    }
  }

  // 새 인풋 추가
  const handleAddContentItem = () => {
    setContentArray(prev => [...prev, ''])
  }

  // 인풋 삭제
  const handleRemoveContentItem = (index: number) => {
    const newArray = contentArray.filter((_, i) => i !== index)
    setContentArray(newArray.length > 0 ? newArray : [''])

    if (selectedCareer) {
      const contentString = newArray.filter(item => item.trim()).join('\n')
      setCareerData(prev =>
        prev.map(item =>
          item.id === selectedCareer.id
            ? { ...item, lawyerCareerContent: contentString, lawyerCareerContentArray: newArray }
            : item
        )
      )
      setSelectedCareer({
        ...selectedCareer,
        lawyerCareerContent: contentString,
        lawyerCareerContentArray: newArray,
      })
    }
  }

  const { mutate: updateCareer, isPending: isSaving } = useUpdateLawyerCareer({
    onSuccess: () => {
      setOriginalData([...careerData])
      setHasUnsavedChanges(false)
      success('이력사항이 성공적으로 저장되었습니다.')
    },
    onError: err => {
      const errorCode = err.response.data.code

      if (errorCode === 4006) {
        error('이력 분류값 또는 이력 항목값이 입력되지 않았습니다. 모두 입력해주세요')
      } else {
        error('이력사항 저장에 실패했습니다. 다시 시도해주세요.')
      }
    },
  })

  const handleSave = () => {
    const formData: LawyerCareerUpdateRequest = careerData.map(item => ({
      lawyerCareerCategoryName: item.lawyerCareerCategoryName,
      lawyerCareerContent: item.lawyerCareerContent,
      lawyerCareerDisplayOrder: item.lawyerCareerDisplayOrder,
    }))
    updateCareer({ lawyerId: Number(lawyerId), careerData: formData })
  }

  const handleCancel = () => {
    navigate(ROUTER.LAWYER_ADMIN_LAWYER_DETAIL)
  }

  // ref를 통해 상위 컴포넌트에 데이터 전달
  useImperativeHandle(ref, () => ({
    getFormData: () =>
      careerData.map(item => ({
        lawyerCareerCategoryName: item.lawyerCareerCategoryName,
        lawyerCareerContent: item.lawyerCareerContent,
        lawyerCareerDisplayOrder: item.lawyerCareerDisplayOrder,
      })),
  }))

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}>로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <HeaderPortal>
        <div className={styles.header}>
          <h1 className={styles.header__title}>이력사항 관리</h1>
          <nav className={styles.header__button}>
            <button type='button' className={styles.header__button__cancel} onClick={handleCancel} disabled={isSaving}>
              취소
            </button>
            <button type='button' className={styles.header__button__save} onClick={handleSave} disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </nav>
        </div>
      </HeaderPortal>

      <section className={styles['lawyer-edit-career']}>
        <article className={styles.panel_container}>
          <h3 className={styles.panel_container__title}>이력 분류를 선택하세요.</h3>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={careerData.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className={styles.categoryList}>
                {careerData.map(career => (
                  <SortableItem
                    key={career.id}
                    career={career}
                    isSelected={selectedCareer?.id === career.id}
                    isEditing={editingCategoryId === career.id}
                    editingCategoryName={editingCategoryName}
                    onCategoryClick={handleCategoryClick}
                    onCategoryNameSave={handleCategoryNameSave}
                    onCategoryNameChange={setEditingCategoryName}
                    onCategoryEditCancel={() => {
                      setEditingCategoryId(null)
                      setEditingCategoryName('')
                    }}
                    onDelete={handleDelete}
                    onClick={handleCareerClick}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button className={styles.addButton} onClick={handleAdd}>
            이력 분류 추가
          </button>
        </article>

        {/* 우측: 내용 편집 */}
        <article className={styles.panel_container}>
          <div className={styles.panel_container__title}>
            이력 분류 {selectedCareer ? `> ${selectedCareer.lawyerCareerCategoryName}` : ''}
          </div>

          <div className={styles.editorContent}>
            {selectedCareer ? (
              <div className={styles.contentInputContainer}>
                {contentArray.map((content, index) => (
                  <div key={index} className={styles.contentInputWrapper}>
                    <input
                      type='text'
                      value={content}
                      onChange={e => handleContentItemChange(index, e.target.value)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      placeholder='1줄씩 입력해주세요'
                      className={styles.contentInput}
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveContentItem(index)}
                      className={styles.contentInputDelete}
                      aria-label='삭제'
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button type='button' onClick={handleAddContentItem} className={styles.addItemButton}>
                  + 항목 추가
                </button>
              </div>
            ) : (
              <div className={styles.emptyContent}>
                <span className={styles.emptyContent__text}>카테고리를 선택해주세요.</span>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  )
})

LawyerEditCareer.displayName = 'LawyerEditCareer'

export default LawyerEditCareer
