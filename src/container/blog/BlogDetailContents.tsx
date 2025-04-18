import { useEffect, useState } from 'react'
import styles from '@/container/blog/blog-detail.contents.module.scss'
import { COLOR } from '@/styles/color'
import { getBlogDetailText } from '@/utils/blogTextFormatter'

type BlogDetailContentsProps = {
  summaryContents: string
  tagList: string[]
}

const AILoading = () => {
  return (
    <div className={styles['skeleton-container']}>
      <div className={styles['skeleton-header']}>
        <span>AI가 해당 블로그의 포스팅글을 분석중입니다.</span>
      </div>
      <div className={styles['skeleton-content']}>
        <div className={styles['skeleton-paragraph']} style={{ width: 149 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 269 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 169 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 238 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 149 }} />
      </div>
    </div>
  )
}

const BlogDetailContents = ({ summaryContents, tagList }: BlogDetailContentsProps) => {
  const [showLoading, setShowLoading] = useState(true)
  const { summary, lawyerPart } = getBlogDetailText(summaryContents)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles['blog-detail-content']}>
      {showLoading ? (
        <AILoading />
      ) : (
        <div className={styles['blog-detail-content-wrapper']}>
          <section>
            <h2 style={{ color: COLOR.green_01 }}>AI 요약</h2>
            <hr className={styles['line-driver']} />
            <p className={styles.summary}>{summary}</p>
          </section>
          <section>
            <h2>변호사 선임의 필요성</h2>
            <hr className={styles['line-driver']} />
            <ul className={styles['lawyer-list']}>
              {lawyerPart.map((item, index) => (
                <li key={index} className={styles['lawyer-item']}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <hr className={styles['line-driver']} style={{ margin: 0 }} />
            <div className={styles['tag-list']}>
              {tagList.map(tag => (
                <span>#{tag}</span>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default BlogDetailContents
