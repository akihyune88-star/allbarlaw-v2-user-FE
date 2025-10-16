/**
 * 주어진 시간(time)과 현재 시간 사이의 경과 시간을 밀리초 단위로 계산합니다.
 *
 * @param time - 경과 시간을 계산할 기준 시간.
 *   Date 객체, 타임스탬프(숫자), 또는 new Date()가 해석할 수 있는 날짜/시간 문자열.
 * @returns 경과 시간 (밀리초 단위). time 형식이 유효하지 않으면 null을 반환합니다.
 */
export const calculateTimeDifference = (time: string | number | Date): number | null => {
  const nowTimestamp = Date.now()
  const pastTimestamp = new Date(time).getTime()

  // 입력된 time이 유효한 날짜/시간인지 확인
  if (isNaN(pastTimestamp)) {
    console.error(`'${time}'은(는) 유효한 날짜/시간 형식이 아닙니다.`)
    return null // 유효하지 않으면 null 반환
  }

  const differenceInMillis = nowTimestamp - pastTimestamp
  return differenceInMillis
}

/**
 * 주어진 시간(time)과 현재 시간 사이의 경과 시간을 포맷팅합니다.
 * - 24시간 이내: 시간으로 표시 (예: "14시간 전")
 * - 25시간 이후 ~ 1주일 이내: 일로 표시 (예: "3일 전")
 * - 1주일 ~ 2주일 이내: "1주 전"
 * - 2주일 ~ 3주일 이내: "2주 전"
 * - 3주일 ~ 4주일 이내: "3주 전"
 * - 4주일 ~ 1달 이내: "1달 전"
 * - 1달 이후: 날짜 표기 (예: "8월 15일")
 *
 * @param time - 경과 시간을 계산할 기준 시간.
 * @returns 포맷팅된 시간 문자열. time 형식이 유효하지 않으면 빈 문자열을 반환합니다.
 */
export const formatTimeAgo = (time: string | number | Date): string => {
  const differenceInMillis = calculateTimeDifference(time)

  if (differenceInMillis === null) {
    return '' // 유효하지 않은 입력 처리
  }

  const seconds = Math.floor(differenceInMillis / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // 24시간 이내: 시간으로 표시
  if (hours < 24) {
    if (hours > 0) {
      return `${hours}시간 전`
    } else if (minutes > 0) {
      return `${minutes}분 전`
    } else {
      return '방금 전'
    }
  }

  // 25시간 이후 ~ 1주일 이내: 일로 표시
  if (days < 7) {
    return `${days}일 전`
  }

  // 1주일 ~ 2주일 이내: "1주 전"
  if (days < 14) {
    return '1주 전'
  }

  // 2주일 ~ 3주일 이내: "2주 전"
  if (days < 21) {
    return '2주 전'
  }

  // 3주일 ~ 4주일 이내: "3주 전"
  if (days < 28) {
    return '3주 전'
  }

  // 4주일 ~ 1달 이내: "1달 전"
  if (days < 30) {
    return '1달 전'
  }

  // 1달 이후: 날짜 표기 (예: "8월 15일")
  const pastDate = new Date(time)
  const month = pastDate.getMonth() + 1
  const day = pastDate.getDate()
  return `${month}월 ${day}일`
}

export const getRelativeTimeString = (date: Date | string): string => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '방금 전'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}일 전`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}년 전`
}

/**
 * 1월부터 12월까지의 SelectBox 옵션 배열을 반환합니다.
 * @returns SelectBox 옵션 형식의 월 배열
 */
export const getMonthsArray = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}월`,
  }))
}

/**
 * 2025년부터 현재 연도까지의 SelectBox 옵션 배열을 반환합니다.
 * @returns SelectBox 옵션 형식의 연도 배열
 * @example 2026년 1월에 접속한 경우 [{ value: 2025, label: '2025년' }, { value: 2026, label: '2026년' }]
 */
export const getYearsFrom2025 = () => {
  const startYear = 2025
  const currentYear = new Date().getFullYear()

  const options: { value: number; label: string }[] = []

  // 현재 연도가 2025년보다 이전인 경우 빈 배열 반환
  if (currentYear < startYear) {
    return options
  }

  // 2025년부터 현재 연도까지의 옵션 생성
  for (let year = startYear; year <= currentYear; year++) {
    options.push({
      value: year,
      label: `${year}년`,
    })
  }

  return options
}
