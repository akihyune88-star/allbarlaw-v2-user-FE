import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import styles from './signUpMain.module.scss'

const SignUpMain = () => {
  return (
    <div className={`${styles['sign-up-main']} center-layout`}>
      <SignUpTitle title='회원가입' />
    </div>
  )
}

export default SignUpMain
