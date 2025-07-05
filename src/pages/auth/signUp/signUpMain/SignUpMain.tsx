import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import styles from './signUpMain.module.scss'
import SocialLoginButton from '@/container/auth/socialLoginButton/SocialLoginButton'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const SignUpMain = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleSignUp = () => navigate(`${ROUTER.AUTH}/${ROUTER.SIGNUP_FORM}`)

  return (
    <main className={`${styles['sign-up-main']} center-layout`}>
      <SignUpTitle title='회원가입' />
      <section className={styles['sign-up-main-section']}>
        <button className={styles['sign-up-btn']} onClick={handleSignUp}>
          일반 회원가입
        </button>
        <SocialLoginButton type='bar' />
      </section>
    </main>
  )
}

export default SignUpMain
