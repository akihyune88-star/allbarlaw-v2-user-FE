export type LegalTermNameLike = {
  koreanName?: string | null
  chineseName?: string | null
}

/**
 * 주어진 항목들의 한국어 이름과 한자를 결합하여 문자열 배열을 생성합니다.
 * 예) koreanName: "사기죄", chineseName: "詐欺罪" → "사기죄 [詐欺罪]"
 */
export function formatKoreanWithHanja(terms: LegalTermNameLike[]): string[] {
  if (!Array.isArray(terms)) return []

  const formatted = terms
    .map(term => {
      const ko = (term.koreanName ?? '').trim()
      const han = (term.chineseName ?? '').trim()
      if (!ko && !han) return null
      if (!han) return ko
      if (!ko) return `[${han}]`
      return `${ko} [${han}]`
    })
    .filter((v): v is string => !!v)

  // 중복 제거
  return Array.from(new Set(formatted))
}
