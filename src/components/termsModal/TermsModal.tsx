import { useRef, useEffect } from 'react'
import Modal from '../modal/Modal'
import { TERMS_OF_SERVICE, PRIVACY_POLICY, MARKETING_TERMS } from '@/constants/terms'
import styles from './termsModal.module.scss'

export type TermsType = 'terms' | 'privacy' | 'marketing'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  type: TermsType
  onTypeChange?: (type: TermsType) => void
}

const MODAL_TITLES: Record<TermsType, string> = {
  terms: '서비스 이용약관',
  privacy: '개인정보처리방침',
  marketing: '마케팅 정보 수집·이용 동의',
}

const MODAL_CONTENTS: Record<TermsType, string> = {
  terms: TERMS_OF_SERVICE,
  privacy: PRIVACY_POLICY,
  marketing: MARKETING_TERMS,
}

const TermsModal = ({ isOpen, onClose, type, onTypeChange }: TermsModalProps) => {
  const content = MODAL_CONTENTS[type]
  const contentRef = useRef<HTMLDivElement>(null)

  // type이 변경되면 스크롤을 맨 위로
  useEffect(() => {
    if (contentRef.current?.parentElement) {
      contentRef.current.parentElement.scrollTop = 0
    }
  }, [type])

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const termsLink = target.closest('[data-terms-link]') as HTMLElement
      if (termsLink) {
        e.preventDefault()
        e.stopPropagation()
        const linkType = termsLink.dataset.termsLink as TermsType
        if (linkType && onTypeChange) {
          onTypeChange(linkType)
        }
      }
    }

    const contentEl = contentRef.current
    contentEl?.addEventListener('click', handleLinkClick)

    return () => {
      contentEl?.removeEventListener('click', handleLinkClick)
    }
  }, [type, onTypeChange])

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.termsModal}>
      <Modal.Header>{MODAL_TITLES[type]}</Modal.Header>
      <Modal.Body className={styles.termsBody}>
        <div ref={contentRef} className={styles.termsContent} dangerouslySetInnerHTML={{ __html: content }} />
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
