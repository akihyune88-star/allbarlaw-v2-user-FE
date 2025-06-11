import SvgIcon from '@/components/SvgIcon'
import styles from './legal-term-list.module.scss'
import { exampleBlogData } from '@/constants/exampleData'
import BlogItem from '@/components/blogItem/BlogItem'

const LegalTermBlogList = () => {
  const first3Items = exampleBlogData.blogCases.slice(0, 3)

  return (
    <div className={styles.container}>
      <header className={`${styles['list-header']} ${styles['blog']}`}>
        <h3>법률정보의 글</h3>
        <button>
          <span>더보기</span>
          <SvgIcon name='arrowSmall' style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </header>
      <section className={styles['list-section']} style={{ paddingTop: 16 }}>
        {first3Items.map(blog => (
          <BlogItem key={blog.blogCaseId} item={blog} />
        ))}
      </section>
    </div>
  )
}

export default LegalTermBlogList
