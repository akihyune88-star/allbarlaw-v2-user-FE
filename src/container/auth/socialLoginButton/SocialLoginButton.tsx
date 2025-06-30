import naverIcon from '@/assets/imgs/naverLogin.webp'
import kakaoIcon from '@/assets/imgs/kakaoLogin.webp'
import googleIcon from '@/assets/imgs/googleLogin.webp'
import styles from './socialLoginButtom.module.scss'

const SOCIAL_LOGIN_BUTTONS = [
  {
    name: 'naver',
    icon: naverIcon,
  },
  {
    name: 'kakao',
    icon: kakaoIcon,
  },
  {
    name: 'google',
    icon: googleIcon,
  },
]

const SocialLoginButton = () => {
  return (
    <div className={styles['social-login-button']}>
      {SOCIAL_LOGIN_BUTTONS.map(button => (
        <figure key={button.name}>
          <img src={button.icon} alt={button.name} className={styles['social-login-image']} />
        </figure>
      ))}
    </div>
  )
}

export default SocialLoginButton
