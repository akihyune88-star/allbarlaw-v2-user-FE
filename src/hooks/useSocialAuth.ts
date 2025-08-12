import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useSocialLogin } from './mutatate/useSocialLogin'
import axios from 'axios'

type SocialProvider = 'kakao' | 'naver' | 'google'

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_KEY
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
const KAKAO_REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URL}/social-check/kakao`
const NAVER_REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URL}/social-check/naver`
const GOOGLE_REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URL}/social-check/google`

export const isValidProvider = (provider: string | undefined): provider is SocialProvider => {
  return provider === 'kakao' || provider === 'naver' || provider === 'google'
}

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

const initializeNaverLogin = () => {
  // 기존 naver_id_login 요소가 있다면 제거
  const existingNaverLogin = document.getElementById('naver_id_login')
  if (existingNaverLogin) {
    existingNaverLogin.remove()
  }

  // 새로운 naver_id_login div 요소 생성 및 추가
  const naverLoginDiv = document.createElement('div')
  naverLoginDiv.id = 'naver_id_login'
  naverLoginDiv.style.display = 'none'
  document.body.appendChild(naverLoginDiv)

  // 네이버 로그인 초기화
  return new window.naver_id_login(NAVER_CLIENT_ID, NAVER_REDIRECT_URI)
}

const getNaverToken = () => {
  const naverLogin = initializeNaverLogin()
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

export const useSocialAuth = (provider: string | undefined) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate: socialLogin } = useSocialLogin({
    onSuccess: () => {
      navigate(ROUTER.MAIN)
    },
    onError: () => {
      // navigate(ROUTER.MAIN + ROUTER.AUTH)
    },
  })

  useEffect(() => {
    const processLogin = async () => {
      console.log('🟡 processLogin 시작')
      console.log('- provider:', provider)
      console.log('- location:', location.pathname)
      console.log('- search:', location.search)
      
      if (!isValidProvider(provider)) {
        console.log('❌ 유효하지 않은 provider:', provider)
        navigate(ROUTER.MAIN + ROUTER.AUTH)
        return
      }

      try {
        let accessToken = ''
        const code = new URLSearchParams(location.search).get('code')
        console.log('- code:', code)

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
          console.log('🔥 소셜 로그인 요청 시작')
          console.log('- provider:', provider)
          console.log('- accessToken:', accessToken)
          
          socialLogin({
            userProvider: provider,
            userAccessToken: accessToken,
          })
        } else {
          console.error('❌ accessToken이 없습니다')
        }
      } catch (error) {
        console.error('소셜 로그인 처리 실패:', error)
        // navigate(ROUTER.MAIN + ROUTER.AUTH)
      }
    }

    processLogin()
  }, [location, navigate, provider, socialLogin])

  return {
    isValidProvider: isValidProvider(provider),
  }
}
