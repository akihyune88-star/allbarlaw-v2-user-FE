import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
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
import { LawyerCareer } from '@/types/lawyerTypes'
import styles from './lawyerEditCareer.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { getLawyerIdFromToken } from '@/utils/tokenUtils'
import { LOCAL } from '@/constants/local'

interface CareerItem {
  id: string
  lawyerCareerCategoryName: string
  lawyerCareerContent: string
  lawyerCareerDisplayOrder: number
}

interface SortableItemProps {
  career: CareerItem
  isSelected: boolean
  isEditing: boolean
  editingCategoryName: string
  onCategoryDoubleClick: (career: CareerItem) => void
  onCategoryNameSave: (id: string) => void
  onCategoryNameChange: (value: string) => void
  onCategoryEditCancel: () => void
  onDelete: (id: string) => void
  onClick: (career: CareerItem) => void
}

const SortableItem = ({
  career,
  isSelected,
  isEditing,
  editingCategoryName,
  onCategoryDoubleClick,
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
        onDoubleClick={
          !isEditing
            ? e => {
                e.stopPropagation()
                onCategoryDoubleClick(career)
              }
            : undefined
        }
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
          <span className={styles.categoryName} title='더블클릭하여 편집'>
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
  getFormData: () => LawyerCareer[]
}

const LawyerEditCareer = forwardRef<LawyerEditCareerRef, {}>((_props, ref) => {
  const navigate = useNavigate()
  const lawyerId = getLawyerIdFromToken(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN) || '')
  const { data: careerDataFromAPI, isLoading } = useLawyerCareer(Number(lawyerId))

  const [careerData, setCareerData] = useState<CareerItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState<CareerItem | null>(null)
  const [contentValue, setContentValue] = useState('')
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
          lawyerCareerDisplayOrder: item.lawyerCareerDisplayOrder || index + 1,
        }))
        setCareerData(initialData)
      } else {
        setCareerData([])
      }
      setIsInitialized(true)
    } else if (!careerDataFromAPI && !isLoading && !isInitialized) {
      setCareerData([])
      setIsInitialized(true)
    }
  }, [careerDataFromAPI, isLoading, isInitialized])

  // 카테고리 선택
  const handleCareerClick = (career: CareerItem) => {
    setSelectedCareer(career)
    setContentValue(career.lawyerCareerContent)
  }

  // 카테고리 이름 더블클릭 시 편집 모드
  const handleCategoryDoubleClick = (career: CareerItem) => {
    setEditingCategoryId(career.id)
    setEditingCategoryName(career.lawyerCareerCategoryName)
  }

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
      lawyerCareerDisplayOrder: careerData.length + 1,
    }
    setCareerData(prev => [...prev, newItem])
    setSelectedCareer(newItem)
    setContentValue('')
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
      setContentValue('')
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

  // 내용 저장
  const handleContentBlur = () => {
    if (selectedCareer && contentValue !== selectedCareer.lawyerCareerContent) {
      setCareerData(prev =>
        prev.map(item => (item.id === selectedCareer.id ? { ...item, lawyerCareerContent: contentValue } : item))
      )
      setSelectedCareer({ ...selectedCareer, lawyerCareerContent: contentValue })
    }
  }

  const { mutate: updateCareer, isPending: isSaving } = useUpdateLawyerCareer({
    onSuccess: () => {},
    onError: error => {
      console.error('경력 저장 중 오류 발생:', error)
      alert('경력 정보 저장에 실패했습니다.')
    },
  })

  const handleSave = () => {
    const formData = careerData.map(({ id, ...rest }) => rest)
    updateCareer({ lawyerId: Number(lawyerId), careerData: formData })
  }

  const handleCancel = () => {
    navigate(ROUTER.LAWYER_ADMIN_LAWYER_DETAIL)
  }

  // ref를 통해 상위 컴포넌트에 데이터 전달
  useImperativeHandle(ref, () => ({
    getFormData: () => careerData.map(({ id, ...rest }) => rest),
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
                    onCategoryDoubleClick={handleCategoryDoubleClick}
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
        <article className={styles.panel_container} style={{ maxHeight: 312 }}>
          <div className={styles.panel_container__title}>
            이력 분류 {selectedCareer ? `> ${selectedCareer.lawyerCareerCategoryName}` : ''}
          </div>

          <div className={styles.editorContent}>
            {selectedCareer ? (
              <textarea
                value={contentValue}
                onChange={e => setContentValue(e.target.value)}
                onBlur={handleContentBlur}
                placeholder='1줄씩 입력 바랍니다.'
                className={styles.contentTextarea}
              />
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
