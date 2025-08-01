declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    Kakao: any
    naver_id_login: any
  }
}

const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const BASE_REDIRECT_URI = import.meta.env.VITE_REDIRECT_URL

export const naverLogin = () => {
  // 기존 네이버 로그인 버튼이 있다면 제거
  const existingButton = document.getElementById('naver_id_login')
  if (existingButton) {
    existingButton.remove()
  }

  // 네이버 로그인 버튼을 위한 div 생성
  const naverLoginDiv = document.createElement('div')
  naverLoginDiv.id = 'naver_id_login'
  naverLoginDiv.style.position = 'absolute'
  naverLoginDiv.style.top = '-10000px'
  document.body.appendChild(naverLoginDiv)

  // 네이버 로그인 초기화
  const naverLogin = new window.naver_id_login(NAVER_CLIENT_ID, `${BASE_REDIRECT_URI}/social-check/naver`)
  naverLogin.init_naver_id_login()

  // 자동으로 네이버 로그인 실행
  const naverLoginButton = document.getElementById('naver_id_login_anchor')
  if (naverLoginButton) {
    naverLoginButton.click()
  }
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
    redirectUri: `${BASE_REDIRECT_URI}/social-check/kakao`,
  })
}

export const googleLogin = () => {
  const redirectUri = `${BASE_REDIRECT_URI}/social-check/google`

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
