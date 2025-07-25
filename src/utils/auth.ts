import { LOCAL } from '@/constants/local'

export const getToken = () => {
  // localStorage와 sessionStorage 모두 확인
  return localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN)
}

export const isAuthenticated = () => {
  return !!getToken()
}

/**
 * 변호사 출신시험 셀렉트박스 옵션 생성 함수
 * @returns {Array<{ value: string, label: string }>} ex) [{ value: '1', label: '1회(2012년)' }, ...]
 */
export function getLawyerExamOptions() {
  const startYear = 2012
  const currentYear = new Date().getFullYear()
  const options = []
  for (let i = 0; i <= currentYear - startYear; i++) {
    const nth = i + 1
    const year = startYear + i
    options.push({ value: String(nth), label: `${nth}회(${year}년)` })
  }
  return options.reverse()
}
