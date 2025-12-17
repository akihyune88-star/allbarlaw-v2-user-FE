import styles from '@/container/blog/blog-detail.contents.module.scss'
import { useFontSizeStore } from '@/stores/fontSizeStore'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import SvgIcon from '@/components/SvgIcon'

type BlogDetailContentsProps = {
  summaryContents: string
  lawyerName?: string
  className?: string
}

// 공통 컴포넌트 (요약 제목은 직접 렌더링하므로 제외)
const baseComponents: Partial<Components> = {
  h2: ({ children }) => {
    const text = String(children)

    // "요약" 제목은 직접 렌더링하므로 숨김
    if (text === '요약') {
      return null
    }

    if (text === '변호사 선임의 필요성') {
      return (
        <>
          <h2 className={styles['summary-title']} style={{ marginTop: '2.125rem' }}>
            <SvgIcon name='aiLight' size={24} />
            변호사 선임의 필요성
          </h2>
          <hr className={styles['line-driver']} />
        </>
      )
    }

    return <h2 className={styles['section-title']}>{children}</h2>
  },
  ul: ({ children }) => <ul className={styles['list']}>{children}</ul>,
  p: ({ children }) => <p className={styles.summary}>{children}</p>,
}

// 요약 섹션용 (SVG bullet)
const summaryComponents: Components = {
  ...baseComponents,
  li: ({ children }) => (
    <li className={styles['summary-item']}>
      <SvgIcon name='aiCheck' size={16} className={styles['summary-item-icon']} />
      <span className={styles['summary-item-text']}>{children}</span>
    </li>
  ),
}

// 변호사 선임의 필요성 섹션용 (dot bullet)
const lawyerComponents: Components = {
  ...baseComponents,
  li: ({ children }) => (
    <li className={styles['lawyer-item']}>
      <span className={styles['lawyer-item-text']}>{children}</span>
    </li>
  ),
}

// 마크다운 문자열을 섹션별로 분리
const splitMarkdownBySections = (markdown: string) => {
  const lawyerSectionMarker = '## 변호사 선임의 필요성'
  const index = markdown.indexOf(lawyerSectionMarker)

  if (index === -1) {
    return { summaryPart: markdown, lawyerPart: '' }
  }

  return {
    summaryPart: markdown.slice(0, index).trim(),
    lawyerPart: markdown.slice(index).trim(),
  }
}

const BlogDetailContents = ({ summaryContents, lawyerName, className }: BlogDetailContentsProps) => {
  const { fontSize } = useFontSizeStore()
  const { summaryPart, lawyerPart } = splitMarkdownBySections(summaryContents)

  return (
    <div className={`${styles['blog-detail-content']} ${className}`}>
      <div className={`${styles['blog-detail-content-wrapper']} ${styles[`font-size-${fontSize}`]}`}>
        {/* AI 요약 제목 직접 렌더링 */}
        <h2 className={styles['summary-title']}>
          <SvgIcon name='aiBubble' size={18} />
          AI 요약
        </h2>
        {lawyerName && (
          <p className={styles['summary-description']}>{lawyerName} 변호사의 글을 AI가 요약한 결과입니다.</p>
        )}
        <hr className={styles['line-driver']} />
        <ReactMarkdown components={summaryComponents}>{summaryPart}</ReactMarkdown>
        {lawyerPart && <ReactMarkdown components={lawyerComponents}>{lawyerPart}</ReactMarkdown>}
        <section>
          <hr className={styles['line-driver']} />
          <div className={styles['warning-text']}>
            {`본 요약은 AI를 활용하여 일부 정보가 부정확하거나 완전하지 않을 수 있습니다.
          참고용으로만 활용하시길 바라며, 구체적 사안에 적용하기에 앞서 변호사 등 전문가의 도움을 반드시 받으시길 바랍니다.`}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BlogDetailContents
