import { useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import styles from './social-check.module.scss'

type SocialProvider = 'kakao' | 'naver' | 'google'

const isValidProvider = (provider: string | undefined): provider is SocialProvider => {
  return provider === 'kakao' || provider === 'naver' || provider === 'google'
}

const SocialCheck = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { provider } = useParams()

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')

    if (code && isValidProvider(provider)) {
      // TODO: 서버에 인증 코드와 제공자 정보 전송
      console.log('인증 코드:', code)
      console.log('소셜 제공자:', provider)

      // 성공 시 메인 페이지로 이동
      // navigate(ROUTER.MAIN)
    } else {
      // 필요한 정보가 없거나 유효하지 않은 provider면 로그인 페이지로 이동
      navigate(ROUTER.MAIN + ROUTER.AUTH)
    }
  }, [location, navigate, provider])

  if (!isValidProvider(provider)) {
    return null // 잘못된 provider면 아무것도 표시하지 않음
  }

  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <p className={styles.text}>로그인 처리 중...</p>
    </div>
  )
}

export default SocialCheck
