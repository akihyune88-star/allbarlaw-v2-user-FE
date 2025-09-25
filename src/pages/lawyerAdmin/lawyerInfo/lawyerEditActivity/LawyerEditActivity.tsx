import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react'
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

interface ActivityItem {
  id: string
  lawyerActivityCategoryName: string
  lawyerActivityContent: string
  lawyerActivityDisplayOrder: number
}

interface SortableItemProps {
  activity: ActivityItem
  isSelected: boolean
  isEditing: boolean
  editingCategoryName: string
  onCategoryClick: (activity: ActivityItem) => void
  onCategoryNameSave: (id: string) => void
  onCategoryNameChange: (value: string) => void
  onCategoryEditCancel: () => void
  onDelete: (id: string) => void
  onClick: (activity: ActivityItem) => void
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

  const [activityData, setActivityData] = useState<ActivityItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [originalData, setOriginalData] = useState<ActivityItem[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)
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
    setContentValue(activity.lawyerActivityContent)
  }

  // 카테고리 이름 클릭 시 편집 모드
  const handleCategoryClick = (activity: ActivityItem) => {
    setEditingCategoryId(activity.id)
    setEditingCategoryName(activity.lawyerActivityCategoryName)
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
    setContentValue('')
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
      setContentValue('')
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

  // 내용 저장
  const handleContentBlur = () => {
    if (selectedActivity && contentValue !== selectedActivity.lawyerActivityContent) {
      setActivityData(prev =>
        prev.map(item => (item.id === selectedActivity.id ? { ...item, lawyerActivityContent: contentValue } : item))
      )
      setSelectedActivity({ ...selectedActivity, lawyerActivityContent: contentValue })
    }
  }

  const { mutate: updateActivity, isPending: isSaving } = useLawyerActivityUpdate({
    onSuccess: () => {
      setOriginalData([...activityData])
      setHasUnsavedChanges(false)
    },
    onError: () => {
      console.error('활동 저장 중 오류 발생')
      alert('활동 정보 저장에 실패했습니다.')
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
    getFormData: () => activityData.map(item => ({
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
        <article className={styles.panel_container} style={{ maxHeight: 312 }}>
          <div className={styles.panel_container__title}>
            활동 분류 {selectedActivity ? `> ${selectedActivity.lawyerActivityCategoryName}` : ''}
          </div>

          <div className={styles.editorContent}>
            {selectedActivity ? (
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

LawyerEditActivity.displayName = 'LawyerEditActivity'

export default LawyerEditActivity
