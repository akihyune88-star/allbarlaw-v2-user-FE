import { useNavigate } from 'react-router-dom'
import styles from './lawyerOnboardingFooter.module.scss'
import { ROUTER } from '@/routes/routerConstant'

const LawyerOnboardingFooter = () => {
  const navigation = useNavigate()

  const handleSignup = () => navigation(`${ROUTER.AUTH}/${ROUTER.LAWYER_SIGNUP_FORM}`)
  return (
    <div className={styles['lawyer-onboarding-footer']}>
      <h2 className={styles['lawyer-onboarding-footer-title']}>
        더 많은 의뢰인과 사건을 만나는 새로운 선택지
        <br />
        올바로와 함께 하세요!
      </h2>

      <nav className={styles['lawyer-onboarding-footer-nav']}>
        <button onClick={handleSignup}>무료 변호사 회원가입</button>
        <button>광고 문의</button>
      </nav>
    </div>
  )
}

export default LawyerOnboardingFooter
