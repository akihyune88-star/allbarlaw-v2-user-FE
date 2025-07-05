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

declare global {
  interface Window {
    naver_id_login: any
  }
}

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_KEY
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
const KAKAO_REDIRECT_URI = 'http://localhost:5173/social-check/kakao'
const NAVER_REDIRECT_URI = 'http://localhost:5173/social-check/naver'
const GOOGLE_REDIRECT_URI = 'http://localhost:5173/social-check/google'

const SocialCheck = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { provider } = useParams()
  const { mutate: socialLogin } = useSocialLogin({
    onSuccess: () => {
      navigate(ROUTER.MAIN)
    },
    onError: () => {
      //   navigate(ROUTER.MAIN + ROUTER.AUTH)
    },
  })

  const getKakaoToken = async (code: string) => {
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_CLIENT_ID,
          redirect_uri: KAKAO_REDIRECT_URI,
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

  const getNaverToken = () => {
    const naverLogin = new window.naver_id_login(NAVER_CLIENT_ID, NAVER_REDIRECT_URI)
    const token = naverLogin.oauthParams.access_token

    if (!token) {
      throw new Error('네이버 액세스 토큰을 찾을 수 없습니다.')
    }

    return token
  }

  const getGoogleToken = async (code: string) => {
    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data.access_token
    } catch (error) {
      console.error('구글 토큰 받아오기 실패:', error)
      throw error
    }
  }

  useEffect(() => {
    const processLogin = async () => {
      if (!isValidProvider(provider)) {
        navigate(ROUTER.MAIN + ROUTER.AUTH)
        return
      }

      try {
        let accessToken = ''
        const code = new URLSearchParams(location.search).get('code')

        switch (provider) {
          case 'kakao':
            if (!code) throw new Error('인증 코드가 없습니다.')
            accessToken = await getKakaoToken(code)
            break
          case 'naver':
            accessToken = getNaverToken()
            break
          case 'google':
            if (!code) throw new Error('인증 코드가 없습니다.')
            accessToken = await getGoogleToken(code)
            break
        }

        if (accessToken) {
          socialLogin({
            userProvider: provider,
            userAccessToken: accessToken,
          })
        }
      } catch (error) {
        console.error('소셜 로그인 처리 실패:', error)
        //   navigate(ROUTER.MAIN + ROUTER.AUTH)
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
