import React, { useState, useRef } from 'react'
import {
  useChangeConsultationContent,
  useChangeConsultationStatus,
  useInfiniteMyConsultationList,
} from '@/hooks/queries/useMypage'
import styles from './myChatList.module.scss'
import ChatListFilter from '../chatListFilter/ChatListFilter'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import Divider from '@/components/divider/Divider'
import { ChatRoomStatus } from '@/types/baroTalkTypes'
import { COLOR } from '@/styles/color'
import Modal, { AlertModal } from '@/components/modal/Modal'
import { KnowledgeItem } from '@/types/knowledgeType'

const MyChatList = ({ sort }: { sort: 'asc' | 'desc' }) => {
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState(8)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editConsultationRequestId, setEditConsultationRequestId] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const { mutate: changeConsultationContent } = useChangeConsultationContent({
    onSuccess: () => {
      setAlertMessage('변경이 완료되었습니다.')
      setEditConsultationRequestId(null)
      setEditModalOpen(false)
      setAlertOpen(true)
    },
    onError: () => {
      setAlertMessage('변경에 실패했습니다. 다시 시도해주세요.')
      setAlertOpen(true)
    },
  })

  const handleYearChange = (year: number) => setYear(year)
  const handleMonthChange = (month: number) => setMonth(month)

  const getStatus = (status: ChatRoomStatus) => {
    switch (status) {
      case 'PENDING':
        return '답변전 변경가능'
      default:
        return '답변완료/변경 불가능'
    }
  }

  const handleDeleteConsultation = (consultationRequestId: number) => {
    changeConsultationStatus({ consultationRequestId, consultationRequestStatus: 'DELETED' })
  }

  const handleHideConsultation = (consultationRequestId: number) => {
    changeConsultationStatus({ consultationRequestId, consultationRequestStatus: 'HIDE' })
  }

  const handleEditConsultation = (KnowledgeItem: KnowledgeItem) => {
    setEditContent(KnowledgeItem.summaryContent)
    setEditTitle(KnowledgeItem.knowledgeTitle)
    setEditConsultationRequestId(KnowledgeItem.knowledgeId)
    setEditModalOpen(true)
  }

  const handleEditConsultationSubmit = () => {
    if (!editConsultationRequestId) return
    changeConsultationContent({
      consultationRequestId: editConsultationRequestId,
      knowledgeTitle: editTitle,
      summaryContent: editContent,
    })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value)
  }

  return (
    <>
      <AlertModal isOpen={alertOpen} onClose={() => setAlertOpen(false)} message={alertMessage} confirmText='확인' />
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
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

      <section className={styles['myChatList']}>
        <aside className={styles['myChatList-aside']}>
          <ChatListFilter year={year} month={month} onYearChange={handleYearChange} onMonthChange={handleMonthChange} />
        </aside>
        <div className={styles['myChatList-main']}>
          {consultationList.length === 0 ? (
            <div className={styles['myChatList-empty']}>
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
                        knowledgeId={consultation.knowledgeId}
                        title={consultation.knowledgeTitle}
                        description={consultation.summaryContent}
                        time={new Date(consultation.lastMessageAt)}
                        lawyerList={consultation.lawyers}
                        knowledgeKeep={consultation.isKeep}
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
                            onClick={() => handleEditConsultation(consultation)}
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
