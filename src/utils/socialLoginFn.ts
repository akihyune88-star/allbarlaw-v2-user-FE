declare global {
  interface Window {
    Kakao: any
  }
}

const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY

export const naverLogin = () => {
  console.log('naverLogin')
}

export const kakaoLogin = () => {
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
    scope: 'profile_nickname, profile_image, account_email', // 동의항목 설정
  })
}

export const googleLogin = () => {
  console.log('googleLogin')
}
