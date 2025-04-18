import styles from '@/container/blog/blog-detail.contents.module.scss'
import { COLOR } from '@/styles/color'
import { getBlogDetailText } from '@/utils/blogTextFormatter'

type BlogDetailContentsProps = {
  summaryContents: string
  tagList: string[]
}

const BlogDetailContents = ({ summaryContents, tagList }: BlogDetailContentsProps) => {
  const { summary, lawyerPart } = getBlogDetailText(summaryContents)

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
            {tagList.map(tag => (
              <span>#{tag}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BlogDetailContents
