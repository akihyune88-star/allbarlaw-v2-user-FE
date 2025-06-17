/**
 * 배열을 지정된 크기의 청크로 나누는 함수
 * @param array 나눌 배열
 * @param size 청크 크기
 * @returns 나뉜 배열들의 배열
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}
