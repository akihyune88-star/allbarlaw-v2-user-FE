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
import { useLawyerActivity, useLawyerActivityUpdate } from '@/hooks/queries/useLawyer'
import { LawyerActivityUpdateRequest } from '@/types/lawyerTypes'
import styles from './lawyerEditActivity.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { getLawyerIdFromToken } from '@/utils/tokenUtils'
import { LOCAL } from '@/constants/local'
import { useFormChange } from '@/contexts/FormChangeContext'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/toast/Toast'

interface ActivityItem {
  id: string
  lawyerActivityCategoryName: string
  lawyerActivityContent: string
  lawyerActivityContentArray?: string[] // 각 줄을 배열로 관리
  lawyerActivityDisplayOrder: number
}

interface SortableItemProps {
  activity: ActivityItem
  isSelected: boolean
  isEditing: boolean
  editingCategoryName: string
  onCategoryClick: (_activity: ActivityItem) => void
  onCategoryNameSave: (_id: string) => void
  onCategoryNameChange: (_value: string) => void
  onCategoryEditCancel: () => void
  onDelete: (_id: string) => void
  onClick: (_activity: ActivityItem) => void
}

const SortableItem = ({
  activity,
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.categoryCard}  ${isDragging ? styles.dragging : ''}`}
      onClick={() => onClick(activity)}
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
            onBlur={() => onCategoryNameSave(activity.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') onCategoryNameSave(activity.id)
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
              onCategoryClick(activity)
            }}
          >
            {activity.lawyerActivityCategoryName || '\u00A0'}
          </span>
        )}
        <div className={styles.categoryActions}>
          <button
            className={styles.deleteButton}
            onClick={e => {
              e.stopPropagation()
              onDelete(activity.id)
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

export interface LawyerEditActivityRef {
  getFormData: () => LawyerActivityUpdateRequest
}

const LawyerEditActivity = forwardRef<LawyerEditActivityRef, {}>((_props, ref) => {
  const navigate = useNavigate()
  const lawyerId = getLawyerIdFromToken(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN) || '')
  const { data: activityDataFromAPI, isLoading } = useLawyerActivity(Number(lawyerId))
  const { setHasUnsavedChanges } = useFormChange()
  const { toasts, removeToast, success, error } = useToast()

  const [activityData, setActivityData] = useState<ActivityItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [originalData, setOriginalData] = useState<ActivityItem[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)
  const [contentArray, setContentArray] = useState<string[]>([])
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
    if (activityDataFromAPI && !isInitialized) {
      // activityDataFromAPI.lawyerActivities로 접근해야 합니다
      const dataArray = activityDataFromAPI.lawyerActivities || []

      if (dataArray.length > 0) {
        const initialData = dataArray.map((item: any, index: number) => ({
          id: `api-${item.lawyerActivityId || index}`,
          lawyerActivityCategoryName: item.lawyerActivityCategoryName || '',
          lawyerActivityContent: item.lawyerActivityContent || '',
          lawyerActivityDisplayOrder: item.lawyerActivityDisplayOrder || index + 1,
        }))
        setActivityData(initialData)
        setOriginalData(initialData)
      } else {
        setActivityData([])
        setOriginalData([])
      }
      setIsInitialized(true)
    } else if (!activityDataFromAPI && !isLoading && !isInitialized) {
      setActivityData([])
      setOriginalData([])
      setIsInitialized(true)
    }
  }, [activityDataFromAPI, isLoading, isInitialized])

  // 카테고리 선택
  const handleActivityClick = (activity: ActivityItem) => {
    setSelectedActivity(activity)
    // Content를 줄 단위로 분리하여 배열로 설정
    const contentLines = activity.lawyerActivityContent
      ? activity.lawyerActivityContent.split('\n').filter(line => line.trim() !== '')
      : []
    setContentArray(contentLines)
  }

  // 카테고리 이름 클릭 핸들러
  const handleCategoryClick = (activity: ActivityItem) => {
    // 이미 선택된 항목을 다시 클릭한 경우 → 편집 모드
    if (selectedActivity?.id === activity.id) {
      setEditingCategoryId(activity.id)
      setEditingCategoryName(activity.lawyerActivityCategoryName)
    } else {
      // 처음 클릭 → 선택만 (우측 패널 표시)
      setSelectedActivity(activity)
      const contentLines = activity.lawyerActivityContent
        ? activity.lawyerActivityContent.split('\n').filter(line => line.trim() !== '')
        : []
      setContentArray(contentLines)
    }
  }

  // 데이터 비교 함수
  const compareData = useCallback((data1: ActivityItem[], data2: ActivityItem[]) => {
    if (data1.length !== data2.length) return false

    return data1.every((item1, index) => {
      const item2 = data2[index]
      return (
        item1.lawyerActivityCategoryName === item2.lawyerActivityCategoryName &&
        item1.lawyerActivityContent === item2.lawyerActivityContent &&
        item1.lawyerActivityDisplayOrder === item2.lawyerActivityDisplayOrder
      )
    })
  }, [])

  // 변경사항 감지
  useEffect(() => {
    const hasChanges = !compareData(activityData, originalData)
    setHasUnsavedChanges(hasChanges)
  }, [activityData, originalData, compareData, setHasUnsavedChanges])

  // 카테고리 이름 저장
  const handleCategoryNameSave = (id: string) => {
    setActivityData(prev =>
      prev.map(item => (item.id === id ? { ...item, lawyerActivityCategoryName: editingCategoryName } : item))
    )
    if (selectedActivity?.id === id) {
      setSelectedActivity(prev => (prev ? { ...prev, lawyerActivityCategoryName: editingCategoryName } : null))
    }
    setEditingCategoryId(null)
    setEditingCategoryName('')
  }

  // 개별 내용 아이템 변경 핸들러
  const handleContentItemChange = (index: number, value: string) => {
    const newContentArray = [...contentArray]
    newContentArray[index] = value
    setContentArray(newContentArray)
  }

  // 엔터 키 입력 시 새 항목 추가
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' && contentArray[index].trim()) {
      e.preventDefault()
      const newContentArray = [...contentArray]
      newContentArray.splice(index + 1, 0, '')
      setContentArray(newContentArray)

      // 다음 인풋으로 포커스 이동
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.${styles.contentInput}`)
        if (inputs[index + 1]) {
          ;(inputs[index + 1] as HTMLInputElement).focus()
        }
      }, 0)
    }
  }

  // 내용 아이템 추가
  const handleAddContentItem = () => {
    setContentArray(prev => [...prev, ''])
    // 새로 추가된 인풋으로 포커스 이동
    setTimeout(() => {
      const inputs = document.querySelectorAll(`.${styles.contentInput}`)
      if (inputs[inputs.length - 1]) {
        ;(inputs[inputs.length - 1] as HTMLInputElement).focus()
      }
    }, 0)
  }

  // 내용 아이템 삭제
  const handleRemoveContentItem = (index: number) => {
    const newContentArray = contentArray.filter((_, i) => i !== index)
    setContentArray(newContentArray)
  }

  // 카테고리 추가
  const handleAdd = () => {
    const newItem: ActivityItem = {
      id: Date.now().toString(),
      lawyerActivityCategoryName: '새 카테고리',
      lawyerActivityContent: '',
      lawyerActivityDisplayOrder: activityData.length + 1,
    }
    setActivityData(prev => [...prev, newItem])
    setSelectedActivity(newItem)
    setContentArray(['']) // 1줄이 보이도록 빈 문자열 1개
  }

  // 카테고리 삭제
  const handleDelete = (id: string) => {
    setActivityData(prev => {
      const filtered = prev.filter(item => item.id !== id)
      return filtered.map((item, index) => ({
        ...item,
        lawyerActivityDisplayOrder: index + 1,
      }))
    })

    if (selectedActivity?.id === id) {
      setSelectedActivity(null)
      setContentArray([])
    }
  }

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setActivityData(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        const reorderedItems = arrayMove(items, oldIndex, newIndex)

        return reorderedItems.map((item, index) => ({
          ...item,
          lawyerActivityDisplayOrder: index + 1,
        }))
      })
    }
  }

  // contentArray가 변경될 때 selectedActivity 업데이트
  useEffect(() => {
    if (selectedActivity) {
      const updatedContent = contentArray.join('\n')
      setActivityData(prev =>
        prev.map(item => (item.id === selectedActivity.id ? { ...item, lawyerActivityContent: updatedContent } : item))
      )
      setSelectedActivity(prev => (prev ? { ...prev, lawyerActivityContent: updatedContent } : null))
    }
  }, [contentArray])

  const { mutate: updateActivity, isPending: isSaving } = useLawyerActivityUpdate({
    onSuccess: () => {
      setOriginalData([...activityData])
      setHasUnsavedChanges(false)
      success('활동사항이 성공적으로 저장되었습니다.')
    },
    onError: err => {
      const errorCode = err.response.data.code

      if (errorCode === 4006) {
        error('활동 분류값 또는 활동 항목값이 입력되지 않았습니다. 모두 입력해주세요')
      } else {
        error('이력사항 저장에 실패했습니다. 다시 시도해주세요.')
      }
    },
  })

  const handleSave = () => {
    const formData: LawyerActivityUpdateRequest = activityData.map(item => ({
      lawyerActivityCategoryName: item.lawyerActivityCategoryName,
      lawyerActivityContent: item.lawyerActivityContent,
      lawyerActivityDisplayOrder: item.lawyerActivityDisplayOrder,
    }))
    updateActivity({ lawyerId: Number(lawyerId), activityData: formData })
  }

  const handleCancel = () => {
    navigate(ROUTER.LAWYER_ADMIN_LAWYER_DETAIL)
  }

  // ref를 통해 상위 컴포넌트에 데이터 전달
  useImperativeHandle(ref, () => ({
    getFormData: () =>
      activityData.map(item => ({
        lawyerActivityCategoryName: item.lawyerActivityCategoryName,
        lawyerActivityContent: item.lawyerActivityContent,
        lawyerActivityDisplayOrder: item.lawyerActivityDisplayOrder,
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
          <h1 className={styles.header__title}>활동사항 관리</h1>
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

      <section className={styles['lawyer-edit-activity']}>
        <article className={styles.panel_container}>
          <h3 className={styles.panel_container__title}>활동 분류를 선택하세요.</h3>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={activityData.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className={styles.categoryList}>
                {activityData.map(activity => (
                  <SortableItem
                    key={activity.id}
                    activity={activity}
                    isSelected={selectedActivity?.id === activity.id}
                    isEditing={editingCategoryId === activity.id}
                    editingCategoryName={editingCategoryName}
                    onCategoryClick={handleCategoryClick}
                    onCategoryNameSave={handleCategoryNameSave}
                    onCategoryNameChange={setEditingCategoryName}
                    onCategoryEditCancel={() => {
                      setEditingCategoryId(null)
                      setEditingCategoryName('')
                    }}
                    onDelete={handleDelete}
                    onClick={handleActivityClick}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button className={styles.addButton} onClick={handleAdd}>
            활동 분류 추가
          </button>
        </article>

        {/* 우측: 내용 편집 */}
        <article className={styles.panel_container}>
          <div className={styles.panel_container__title}>
            활동 분류 {selectedActivity ? `> ${selectedActivity.lawyerActivityCategoryName}` : ''}
          </div>

          <div className={styles.editorContent}>
            {selectedActivity ? (
              <div className={styles.contentInputContainer}>
                {contentArray.length === 0 ? (
                  <div className={styles.emptyContent}>
                    <div className={styles.emptyContent__text}>
                      활동사항을 입력해 주세요.
                      <br />
                      아래 버튼을 눌러 항목을 추가하세요.
                    </div>
                  </div>
                ) : (
                  contentArray.map((content, index) => (
                    <div key={index} className={styles.contentInputWrapper}>
                      <input
                        type='text'
                        className={styles.contentInput}
                        value={content}
                        onChange={e => handleContentItemChange(index, e.target.value)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        placeholder='활동사항을 입력해 주세요 (예: 대한변호사협회 이사)'
                      />
                      <button
                        className={styles.contentInputDelete}
                        onClick={() => handleRemoveContentItem(index)}
                        aria-label='삭제'
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
                <button className={styles.addItemButton} onClick={handleAddContentItem}>
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

LawyerEditActivity.displayName = 'LawyerEditActivity'

export default LawyerEditActivity
