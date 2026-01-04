import React, { useState, useRef, useEffect } from 'react'
import { useInfiniteMyConsultationList } from '@/hooks/queries/useMypage'
import styles from './myChatList.module.scss'
import ChatListFilter from '../chatListFilter/ChatListFilter'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import Divider from '@/components/divider/Divider'
import { ChatRoomStatus } from '@/types/baroTalkTypes'
import { COLOR } from '@/styles/color'
import Modal, { AlertModal } from '@/components/modal/Modal'
import { useNavigate } from 'react-router-dom'
import {
  useChangeConsultationContent,
  useChangeConsultationStatus,
  useGetConsultationRequestItem,
} from '@/hooks/queries/useBaroTalk'

interface MyChatListProps {
  sort: 'asc' | 'desc'
  year: number
  month: number
  onYearChange: (_year: number) => void
  onMonthChange: (_month: number) => void
}

interface ModifyConsultationRequestModalProps {
  isOpen: boolean
  onClose: () => void
  consultationRequestItemId: number
  setAlertMessage: (_message: string) => void
  setAlertOpen: (_open: boolean) => void
}

const ModifyConsultationRequestModal = ({
  isOpen,
  onClose,
  consultationRequestItemId,
  setAlertMessage,
  setAlertOpen,
}: ModifyConsultationRequestModalProps) => {
  const { data: consultationRequestItem } = useGetConsultationRequestItem(consultationRequestItemId)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { mutate: changeConsultationContent } = useChangeConsultationContent({
    onSuccess: () => {
      onClose()
      setAlertMessage('변경이 완료되었습니다.')
      setAlertOpen(true)
    },
    onError: () => {
      setAlertMessage('변경에 실패했습니다. 다시 시도해주세요.')
      setAlertOpen(true)
    },
  })

  useEffect(() => {
    if (consultationRequestItem) {
      setEditTitle(consultationRequestItem.consultationRequestTitle)
      setEditContent(consultationRequestItem.consultationRequestFirstMessage)
    }
  }, [consultationRequestItem])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value)
  }

  const handleEditConsultationSubmit = () => {
    changeConsultationContent({
      consultationRequestId: consultationRequestItemId,
      consultationRequestTitle: editTitle,
      consultationRequestFirstMessage: editContent,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles['myChatList-edit-modal']}>
        <h3>상담 내용 수정</h3>
        <input
          type='text'
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          className={styles['myChatList-edit-modal-input']}
        />
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={handleTextareaChange}
          className={styles['myChatList-edit-modal-textarea']}
          style={{
            height: '300px',
            resize: 'none',
            overflow: 'auto',
          }}
        />
        <button onClick={handleEditConsultationSubmit}>수정</button>
      </div>
    </Modal>
  )
}

const MyChatList = ({ sort, year, month, onYearChange, onMonthChange }: MyChatListProps) => {
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [editConsultationRequestItemId, setEditConsultationRequestItemId] = useState<number | null>(null)

  const navigate = useNavigate()

  const { consultationList } = useInfiniteMyConsultationList({
    year,
    month,
    sort,
  })

  const { mutate: changeConsultationStatus } = useChangeConsultationStatus({
    onSuccess: () => {
      setAlertMessage('변경이 완료되었습니다.')
      setAlertOpen(true)
    },
    onError: () => {
      setAlertMessage('변경에 실패했습니다. 다시 시도해주세요.')
      setAlertOpen(true)
    },
  })

  const handleYearChange = (year: number) => onYearChange(year)
  const handleMonthChange = (month: number) => onMonthChange(month)

  const getStatus = (status: ChatRoomStatus) => {
    switch (status) {
      case 'PENDING':
        return '답변전 변경가능'
      default:
        return '답변완료/변경 불가능'
    }
  }

  const handleDeleteConsultation = (consultationRequestId: number) => {
    setDeleteTargetId(consultationRequestId)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      changeConsultationStatus({ consultationRequestId: deleteTargetId, consultationRequestStatus: 'DELETED' })
      setDeleteModalOpen(false)
      setDeleteTargetId(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteModalOpen(false)
    setDeleteTargetId(null)
  }

  const handleHideConsultation = (consultationRequestId: number) => {
    changeConsultationStatus({ consultationRequestId, consultationRequestStatus: 'HIDE' })
  }

  const handleEditConsultation = (KnowledgeId: number) => {
    setEditConsultationRequestItemId(KnowledgeId)
    setEditModalOpen(true)
  }

  const goToChatRoom = (_consultationRequestId: number) => {
    navigate(`/chat`)
  }

  return (
    <>
      <AlertModal isOpen={alertOpen} onClose={() => setAlertOpen(false)} message={alertMessage} confirmText='확인' />

      <Modal isOpen={deleteModalOpen} onClose={handleCancelDelete}>
        <div className={styles['myChatList-edit-modal']}>
          <h3>정말 삭제하시겠습니까?</h3>
          <p style={{ margin: '1rem 0', textAlign: 'center' }}>삭제된 상담 내역은 복구할 수 없습니다.</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button onClick={handleCancelDelete} style={{ backgroundColor: COLOR.bg_gray_disable, border: 'none' }}>
              취소
            </button>
            <button onClick={handleConfirmDelete}>삭제</button>
          </div>
        </div>
      </Modal>

      {editConsultationRequestItemId && (
        <ModifyConsultationRequestModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          consultationRequestItemId={editConsultationRequestItemId}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
        />
      )}

      <section className={styles['myChatList']}>
        <aside className={styles['myChatList-aside']}>
          <ChatListFilter year={year} month={month} onYearChange={handleYearChange} onMonthChange={handleMonthChange} />
        </aside>
        <div className={styles['myChatList-main']}>
          {consultationList.length === 0 ? (
            <div
              className={styles['myChatList-empty']}
              style={{ backgroundColor: consultationList.length === 0 ? 'transparent' : 'white' }}
            >
              <div className={styles['myChatList-empty-content']}>
                <h3 className={styles['myChatList-empty-title']}>상담 내역이 없습니다</h3>
                <p className={styles['myChatList-empty-description']}>
                  {year}년 {month}월에 진행한 상담이 없습니다.
                  <br />
                  변호사와 상담을 시작해보세요.
                </p>
              </div>
            </div>
          ) : (
            <ul className={styles['myChatList-list']}>
              {consultationList.map((consultation, index) => {
                const isEdit = consultation.chatRoomStatus === 'PENDING'
                return (
                  <li key={consultation.knowledgeId}>
                    <article className={styles['myChatListList-item']}>
                      <LegalKnowledgeItem
                        onClick={() => goToChatRoom(consultation.knowledgeId)}
                        knowledgeId={consultation.knowledgeId}
                        title={consultation.knowledgeTitle}
                        description={consultation.summaryContent}
                        time={new Date(consultation.lastMessageAt)}
                        lawyerList={consultation.lawyers}
                        isShowKeep={false}
                        isLastAnswer={true}
                      />
                      <footer className={styles['myChatListList-item-footer']}>
                        <span
                          className={styles['myChatListList-item-status']}
                          style={{ color: isEdit ? COLOR.green_01 : COLOR.error }}
                        >
                          {getStatus(consultation.chatRoomStatus)}
                        </span>
                        <nav className={styles['myChatListList-item-button']} aria-label='상담 액션'>
                          <button
                            type='button'
                            aria-label='상담 내용 수정'
                            disabled={!isEdit}
                            onClick={() => handleEditConsultation(consultation.knowledgeId)}
                          >
                            수정
                          </button>
                          <button
                            type='button'
                            aria-label='상담 비공개 설정'
                            disabled={!isEdit}
                            onClick={() => handleHideConsultation(consultation.knowledgeId)}
                          >
                            {consultation.chatRoomStatus === 'HIDE' ? '공개' : '비공개'}
                          </button>
                          <button
                            type='button'
                            aria-label='채팅방 삭제'
                            disabled={!isEdit}
                            onClick={() => handleDeleteConsultation(consultation.knowledgeId)}
                          >
                            삭제
                          </button>
                        </nav>
                      </footer>
                    </article>
                    {index !== consultationList.length - 1 && <Divider padding={24} />}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

export default MyChatList
