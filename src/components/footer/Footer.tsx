import { CSSProperties, useState, MouseEvent } from 'react'
import styles from './footer.module.scss'
import Divider from '../divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import TermsModal, { TermsType } from '../termsModal/TermsModal'
import { AlertModal } from '@/components/modal/Modal'
import { useAuth } from '@/contexts/AuthContext'

interface FooterProps {
  className?: string
  style?: CSSProperties
}

const Footer = ({ className, style }: FooterProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()
  const { isLoggedIn, isLawyer } = useAuth()
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [termsType, setTermsType] = useState<TermsType>('terms')
  const [alertModalOpen, setAlertModalOpen] = useState(false)

  const handleOpenTerms = (e: MouseEvent, type: TermsType) => {
    e.preventDefault()
    e.stopPropagation()
    setTermsType(type)
    setTermsModalOpen(true)
  }

  const handleLawyerAdmin = () => {
    if (!isLoggedIn) {
      // 로그인 안됨 -> 바로 로그인 페이지로 이동
      navigate(ROUTER.AUTH)
      return
    }

    if (!isLawyer) {
      // 변호사 아님 -> 알림 모달 표시
      setAlertModalOpen(true)
      return
    }

    navigate(ROUTER.LAWYER_ADMIN)
  }

  return (
    <div className={`${styles['footer-container']} ${className}`} style={style}>
      <header className={styles['footer-header']}>
        <span>
          <strong>(주)올바로 |</strong> 당신의 법률 문제
        </span>
        <div className={styles['button-wrapper']}>
          <button onClick={() => navigate(ROUTER.SUPPORT_NOTICE)}>공지사항</button>
          <span className={styles.divider}>|</span>
          <button onClick={() => navigate(ROUTER.FAQ)}>FAQ</button>
          <span className={styles.divider}>|</span>
          <button onClick={handleLawyerAdmin}>변호사 페이지</button>
        </div>
      </header>
      {!isMobile && <Divider padding={12} />}
      <section className={styles['footer-content']}>
        <p>
          사업자등록번호 : 495-35-01382 | 대표이사 : 이현이 | 컨텐츠 및 제휴 문의 : <strong>T.</strong>02-525-1131
          <strong style={{ marginLeft: 8 }}>E.</strong> allbarlaw@allbarlaw.com
        </p>
        <p>
          {`본 웹사이트는 일반적인 정보 제공 목적으로 제작 및 운영되고 있는 것이며, 법률적 자문이나 해석을 위한 목적이 아닙니다.
          본 웹사이트에서 취득한 정보를 바탕으로 특정 조치를 취하시기 전 반드시 법률전문가와 상담을 진행하시기를 권유 드립니다.
          본 웹사이트에서 취득한 정보로 인해 직간접적인 손해를 입었다고 하더라도 올바로는 어떠한 법적 책임을 지지 않습니다.`}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type='button' onClick={e => handleOpenTerms(e, 'privacy')}>
            개인정보처리방침
          </button>
          <span className={styles.divider}> | </span>
          <button type='button' onClick={e => handleOpenTerms(e, 'terms')}>
            이용약관
          </button>
        </div>
        <strong>Allbarlaw Co., Ltd. All Rights Reserved.</strong>
      </section>
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        type={termsType}
        onTypeChange={setTermsType}
      />
      <AlertModal isOpen={alertModalOpen} onClose={() => setAlertModalOpen(false)} message="변호사만 접근할 수 있습니다." />
    </div>
  )
}

export default Footer
