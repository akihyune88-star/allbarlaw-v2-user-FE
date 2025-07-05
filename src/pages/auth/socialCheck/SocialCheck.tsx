import { useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import styles from './social-check.module.scss'
import { useSocialLogin } from '@/hooks/mutatate/useSocialLogin'
import axios from 'axios'

type SocialProvider = 'kakao' | 'naver' | 'google'

const isValidProvider = (provider: string | undefined): provider is SocialProvider => {
  return provider === 'kakao' || provider === 'naver' || provider === 'google'
}

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_KEY
const REDIRECT_URI = 'http://localhost:5173/social-check/kakao'

const SocialCheck = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { provider } = useParams()
  const { mutate: socialLogin } = useSocialLogin({
    onSuccess: () => {
      navigate(ROUTER.MAIN)
    },
    onError: () => {
      navigate(ROUTER.MAIN + ROUTER.AUTH)
    },
  })

  const getKakaoToken = async (code: string) => {
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      return response.data.access_token
    } catch (error) {
      console.error('카카오 토큰 받아오기 실패:', error)
      throw error
    }
  }

  useEffect(() => {
    const processLogin = async () => {
      const code = new URLSearchParams(location.search).get('code')

      if (code && isValidProvider(provider)) {
        try {
          let accessToken = ''

          switch (provider) {
            case 'kakao':
              accessToken = await getKakaoToken(code)
              break
            // 다른 provider 케이스는 나중에 추가
          }

          if (accessToken) {
            socialLogin({
              userProvider: provider,
              userAccessToken: accessToken,
            })
          }
        } catch (error) {
          console.error('소셜 로그인 처리 실패:', error)
          navigate(ROUTER.MAIN + ROUTER.AUTH)
        }
      } else {
        navigate(ROUTER.MAIN + ROUTER.AUTH)
      }
    }

    processLogin()
  }, [location, navigate, provider])

  if (!isValidProvider(provider)) {
    return null
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
