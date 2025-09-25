import Modal from './Modal'
import styles from './modal.module.scss'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
  confirmText?: string
  cancelText?: string
  className?: string
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = '확인',
  cancelText = '취소',
  className
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} type='alert' className={className}>
      <Modal.Body>
        <div className={styles.alertContent}>{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.confirmButtons}>
          <button className={styles.cancelButton} onClick={onClose}>
            {cancelText}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal