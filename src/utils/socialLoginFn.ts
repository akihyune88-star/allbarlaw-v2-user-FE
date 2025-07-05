import { ROUTER } from '@/routes/routerConstant'

declare global {
  interface Window {
    Kakao: any
  }
}

const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export const naverLogin = () => {
  const state = Math.random().toString(36).slice(2)
  const redirectUri = 'http://localhost:5173/social-check/naver'

  // 네이버 로그인 URL 생성
  const naverAuthUrl = new URL('https://nid.naver.com/oauth2.0/authorize')
  naverAuthUrl.searchParams.append('response_type', 'code')
  naverAuthUrl.searchParams.append('client_id', NAVER_CLIENT_ID)
  naverAuthUrl.searchParams.append('redirect_uri', redirectUri)
  naverAuthUrl.searchParams.append('state', state)
  naverAuthUrl.searchParams.append('scope', 'name email profile_image')

  // 네이버 로그인 페이지로 리다이렉트
  window.location.href = naverAuthUrl.toString()
}

export const kakaoLogin = () => {
  // 기존 인스턴스 정리
  if (window.Kakao.Auth && window.Kakao.Auth.getAccessToken()) {
    window.Kakao.Auth.logout()
  }
  window.Kakao.cleanup()

  // 새로운 초기화
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_KEY)
  }

  window.Kakao.Auth.login({
    success: (_authObj: any) => {
      // 로그인 성공 시 사용자 정보 요청
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: (res: any) => {
          const kakaoAccount = res.kakao_account
          const data = {
            socialId: res.id.toString(),
            email: kakaoAccount.email,
            nickname: kakaoAccount.profile.nickname,
            profileImage: kakaoAccount.profile.profile_image_url,
            provider: 'KAKAO',
          }
          // TODO: 서버에 소셜 로그인 요청
          console.log('카카오 로그인 성공:', data)
        },
        fail: (error: any) => {
          console.error('카카오 사용자 정보 요청 실패:', error)
        },
      })
    },
    fail: (error: any) => {
      console.error('카카오 로그인 실패:', error)
    },
    scope: 'profile_nickname, profile_image, account_email',
    redirectUri: 'http://localhost:5173/social-check/kakao',
  })
}

export const googleLogin = () => {
  const redirectUri = 'http://localhost:5173/social-check/google'

  // 구글 로그인 URL 생성
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID)
  googleAuthUrl.searchParams.append('response_type', 'code')
  googleAuthUrl.searchParams.append('redirect_uri', redirectUri)
  googleAuthUrl.searchParams.append('scope', 'email profile')
  googleAuthUrl.searchParams.append('access_type', 'offline')
  googleAuthUrl.searchParams.append('prompt', 'consent')

  // 구글 로그인 페이지로 리다이렉트
  window.location.href = googleAuthUrl.toString()
}
