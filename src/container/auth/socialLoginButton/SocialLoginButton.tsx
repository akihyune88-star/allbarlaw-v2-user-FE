import naverIcon from '@/assets/imgs/naverLogin.webp'
import kakaoIcon from '@/assets/imgs/kakaoLogin.webp'
import googleIcon from '@/assets/imgs/googleLogin.webp'
import styles from './socialLoginButtom.module.scss'
import { KeyOfIcon } from '@/types/svg'
import SvgIcon from '@/components/SvgIcon'
import { googleLogin, kakaoLogin, naverLogin } from '@/utils/socialLoginFn'

type SocialLoginButtonType = {
  name: string
  icon: string
  svgIcon: KeyOfIcon
  onClick: () => void
}

const SOCIAL_LOGIN_BUTTONS: SocialLoginButtonType[] = [
  { name: '네이버', icon: naverIcon, svgIcon: 'naver', onClick: naverLogin },
  {
    name: '카카오',
    icon: kakaoIcon,
    svgIcon: 'kakao',
    onClick: kakaoLogin,
  },
  {
    name: '구글',
    icon: googleIcon,
    svgIcon: 'google',
    onClick: googleLogin,
  },
]

const SocialLoginButton = ({ type }: { type: 'bar' | 'icon' }) => {
  return (
    <div className={styles['social-login-button']} data-type={type}>
      {SOCIAL_LOGIN_BUTTONS.map(button =>
        type === 'bar' ? (
          <button key={button.name} className={styles[`${button.svgIcon}-btn`]} onClick={button.onClick}>
            <SvgIcon name={button.svgIcon} />
            <span>{button.name} 회원가입</span>
          </button>
        ) : (
          <div key={button.name} onClick={button.onClick} style={{ cursor: 'pointer' }}>
            <img src={button.icon} alt={button.name} className={styles['social-login-image']} />
          </div>
        )
      )}
    </div>
  )
}

export default SocialLoginButton
