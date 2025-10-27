import { ReactNode } from 'react'
import Modal from '@/components/modal'
import styles from './withdrawModal.module.scss'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  noticeText: ReactNode
  withdrawReason: string
  onReasonChange: (value: string) => void
  onConfirm: () => void
  isPending: boolean
  cancelButtonText?: string
  confirmButtonText?: string
}

const WithdrawModal = ({
  isOpen,
  onClose,
  title,
  noticeText,
  withdrawReason,
  onReasonChange,
  onConfirm,
  isPending,
  cancelButtonText = '취소',
  confirmButtonText = '탈퇴하기 완료',
}: WithdrawModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.withdrawModalWrapper}>
      <Modal.Header>
        <h2>{title}</h2>
      </Modal.Header>
      <Modal.Body className={styles.withdrawModalBody}>
        <div className={styles.withdrawModal}>
          <div className={styles.withdrawContent}>
            <div className={styles.withdrawLabel}>탈퇴 사유 입력</div>
            <textarea
              className={styles.withdrawTextarea}
              placeholder='탈퇴사유를 100자이내로 입력하여주세요'
              maxLength={100}
              value={withdrawReason}
              onChange={e => onReasonChange(e.target.value)}
            />
          </div>
          <div className={styles.withdrawNotice}>{noticeText}</div>
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.withdrawModalFooter}>
        <button onClick={onClose} className={styles.cancelButton} disabled={isPending}>
          {cancelButtonText}
        </button>
        <button onClick={onConfirm} className={styles.confirmButton} disabled={isPending || !withdrawReason.trim()}>
          {isPending ? '처리 중...' : confirmButtonText}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default WithdrawModal
