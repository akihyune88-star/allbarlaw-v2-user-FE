import styles from '@/container/blog/blog-detail.contents.module.scss'
import { COLOR } from '@/styles/color'
import { getBlogDetailText } from '@/utils/blogTextFormatter'

type BlogDetailContentsProps = {
  summaryContents: string
  tagList: string[] | { id: number; name: string }[]
}

const BlogDetailContents = ({ summaryContents, tagList }: BlogDetailContentsProps) => {
  const { summary, lawyerPart } = getBlogDetailText(summaryContents)

  // tagList가 객체 배열인지 문자열 배열인지 확인하고 처리
  const normalizedTags = tagList.map((tag, index) => {
    if (typeof tag === 'string') {
      return <span key={index}>#{tag}</span>
    } else if (tag && typeof tag === 'object' && 'name' in tag) {
      return <span key={tag.id || index}>#{tag.name}</span>
    }
    return null
  })

  return (
    <div className={styles['blog-detail-content']}>
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
            {normalizedTags}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BlogDetailContents
