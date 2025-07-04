import naverIcon from '@/assets/imgs/naverLogin.webp'
import kakaoIcon from '@/assets/imgs/kakaoLogin.webp'
import googleIcon from '@/assets/imgs/googleLogin.webp'
import styles from './socialLoginButtom.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { KeyOfIcon } from '@/types/svg'
import SvgIcon from '@/components/SvgIcon'

const SOCIAL_LOGIN_BUTTONS: { name: string; icon: string; svgIcon: KeyOfIcon }[] = [
  { name: '네이버', icon: naverIcon, svgIcon: 'naver' },
  {
    name: '카카오',
    icon: kakaoIcon,
    svgIcon: 'kakao',
  },
  {
    name: '구글',
    icon: googleIcon,
    svgIcon: 'google',
  },
]

const SocialLoginButton = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  return (
    <div className={styles['social-login-button']}>
      {SOCIAL_LOGIN_BUTTONS.map(button =>
        isMobile ? (
          <button key={button.name} className={styles[`${button.svgIcon}-btn`]}>
            <SvgIcon name={button.svgIcon} />
            <span>{button.name} 회원가입</span>
          </button>
        ) : (
          <div key={button.name}>
            <img src={button.icon} alt={button.name} className={styles['social-login-image']} />
          </div>
        )
      )}
    </div>
  )
}

export default SocialLoginButton
