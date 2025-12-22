import Modal from '../modal/Modal'
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '@/constants/terms'
import styles from './termsModal.module.scss'

export type TermsType = 'terms' | 'privacy'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  type: TermsType
}

const MODAL_TITLES: Record<TermsType, string> = {
  terms: '서비스 이용약관',
  privacy: '개인정보처리방침',
}

const TermsModal = ({ isOpen, onClose, type }: TermsModalProps) => {
  const content = type === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.termsModal}>
      <Modal.Header>{MODAL_TITLES[type]}</Modal.Header>
      <Modal.Body className={styles.termsBody}>
        <div className={styles.termsContent} dangerouslySetInnerHTML={{ __html: content }} />
      </Modal.Body>
      <Modal.Footer>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default TermsModal
