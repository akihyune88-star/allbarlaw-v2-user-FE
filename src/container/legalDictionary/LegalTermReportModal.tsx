import Modal from '@/components/modal'
import styles from './legal-term-report-modal.module.scss'
import { useReportLegalTerm } from '@/hooks/queries/useLegalTerm'

interface LegalTermReportModalProps {
  isOpen: boolean
  onClose: () => void
}

const LegalTermReportModal = ({ isOpen, onClose }: LegalTermReportModalProps) => {
  const { mutate: reportLegalTerm } = useReportLegalTerm({
    onSuccess: () => {
      onClose()
    },
  })

  const handleReportLegalTerm = () => {
    reportLegalTerm({ legalTermId: 1, request: { reportType: 'CONTENT_ERROR', description: 'test' } })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <Modal.Header className={styles.header}>
        <p className={styles.title}>법률 용어 오류신고</p>
      </Modal.Header>
      <Modal.Body className={styles.body}>
        <span>용어명</span>
        <input placeholder='용어를 작성해주세요'></input>
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <button className={`${styles.btn} ${styles.cancel}`}>취소</button>
        <button className={`${styles.btn} ${styles.report}`}>신고하기</button>
      </Modal.Footer>
    </Modal>
  )
}

export default LegalTermReportModal
