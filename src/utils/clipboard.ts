/**
 * 현재 페이지 URL을 클립보드에 복사
 * @param url - 복사할 URL (기본값: 현재 페이지 URL)
 * @param successMessage - 성공 메시지 (기본값: '링크가 복사되었습니다.')
 * @returns Promise<boolean> - 복사 성공 여부
 */
export const copyUrlToClipboard = async (
  url?: string,
  successMessage: string = '링크가 복사되었습니다.'
): Promise<boolean> => {
  try {
    const targetUrl = url || window.location.href
    await navigator.clipboard.writeText(targetUrl)
    alert(successMessage)
    return true
  } catch (error) {
    console.error('Failed to copy URL:', error)
    alert('링크 복사에 실패했습니다.')
    return false
  }
}

/**
 * 텍스트를 클립보드에 복사
 * @param text - 복사할 텍스트
 * @param successMessage - 성공 메시지
 * @returns Promise<boolean> - 복사 성공 여부
 */
export const copyToClipboard = async (
  text: string,
  successMessage?: string
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    if (successMessage) {
      alert(successMessage)
    }
    return true
  } catch (error) {
    console.error('Failed to copy text:', error)
    alert('복사에 실패했습니다.')
    return false
  }
}