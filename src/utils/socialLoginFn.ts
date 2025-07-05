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
  // 네이버 로그인 초기화 및 설정
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=http://localhost:5173/social-check/naver&state=${Math.random()
    .toString(36)
    .slice(2)}`
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
    success: (authObj: any) => {
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
  // 구글 로그인 초기화 및 설정
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:5173/social-check/google&scope=email profile`
}
