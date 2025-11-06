import styles from '@/container/blog/blog-detail.contents.module.scss'
import { useSearchStore } from '@/stores/searchStore'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

type BlogDetailContentsProps = {
  summaryContents: string
  tagList: string[] | { id: number; name: string }[]
  className?: string
}

// 커스텀 마크다운 컴포넌트를 컴포넌트 외부로 이동
const markdownComponents: Components = {
  h2: ({ children }) => {
    const text = String(children)

    // "요약" 제목일 경우
    if (text === '요약') {
      return (
        <>
          <h2 className={styles['summary-title']}>AI 요약</h2>
          <hr className={styles['line-driver']} />
        </>
      )
    }

    // "변호사 선임의 필요성" 제목일 경우
    if (text === '변호사 선임의 필요성') {
      return (
        <>
          <h2 className={styles['section-title']} style={{ marginTop: '2rem' }}>
            변호사 선임의 필요성
          </h2>
          <hr className={styles['line-driver']} />
        </>
      )
    }

    // 그 외 일반 h2
    return <h2 className={styles['section-title']}>{children}</h2>
  },
  ul: ({ children }) => <ul className={styles['lawyer-list']}>{children}</ul>,
  li: ({ children }) => (
    <li className={styles['lawyer-item']}>
      <span className={styles['lawyer-item-text']}>{children}</span>
    </li>
  ),
  p: ({ children }) => <p className={styles.summary}>{children}</p>,
}

const BlogDetailContents = ({ summaryContents, tagList, className }: BlogDetailContentsProps) => {
  const navigate = useNavigate()
  const { setSearchQuery } = useSearchStore()

  const handleTagSearch = (tagName: string) => {
    setSearchQuery(tagName)
    navigate(`/search?q=${tagName}`)
  }

  // tagList가 객체 배열인지 문자열 배열인지 확인하고 처리
  const normalizedTags = tagList.map((tag, index) => {
    if (typeof tag === 'string') {
      return (
        <span
          key={index}
          onClick={() => handleTagSearch(tag)}
          className={styles['tag-item']}
          style={{ cursor: 'pointer' }}
        >
          #{tag}
        </span>
      )
    } else if (tag && typeof tag === 'object' && 'name' in tag) {
      return (
        <span
          key={tag.id || index}
          onClick={() => handleTagSearch(tag.name)}
          className={styles['tag-item']}
          style={{ cursor: 'pointer' }}
        >
          #{tag.name}
        </span>
      )
    }
    return null
  })

  return (
    <div className={`${styles['blog-detail-content']} ${className}`}>
      <div className={styles['blog-detail-content-wrapper']}>
        <ReactMarkdown components={markdownComponents}>{summaryContents}</ReactMarkdown>
        <section>
          <hr className={styles['line-driver']} style={{ margin: 0 }} />
          <div className={styles['tag-list']}>{normalizedTags}</div>
        </section>
      </div>
    </div>
  )
}

export default BlogDetailContents
