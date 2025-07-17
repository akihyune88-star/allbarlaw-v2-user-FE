import { isAxiosError } from 'axios'

interface ErrorResponse {
  message: string
  code?: string
  status?: number
}

export const errorHandler = (error: unknown): ErrorResponse => {
  if (isAxiosError(error)) {
    // Axios 에러 처리
    return {
      message: error.response?.data?.message || error.message || '서버 에러가 발생했습니다.',
      code: error.response?.data?.code,
      status: error.response?.status,
    }
  }

  if (error instanceof Error) {
    // 일반 Error 객체 처리
    return {
      message: error.message || '알 수 없는 에러가 발생했습니다.',
    }
  }

  // 기타 에러 처리
  return {
    message: '알 수 없는 에러가 발생했습니다.',
  }
}

// 에러 메시지를 사용자 친화적으로 변환
export const getErrorMessage = (code: string): string => {
  const errorMessages: Record<string, string> = {
    4013: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요',
    4015: '서비스 이용이 일시 제한되었습니다. 고객센터로 문의해주세요.',
    4009: '이미 가입된 휴대폰 번호입니다.',
    4006: '입력값을 확인해주세요.',
    4010: '인증번호가 유효하지 않습니다. 다시 발송해주세요',
  }

  return code ? errorMessages[code] : '알 수 없는 에러가 발생했습니다.'
}
