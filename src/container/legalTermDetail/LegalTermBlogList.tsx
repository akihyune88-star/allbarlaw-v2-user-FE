import SvgIcon from '@/components/SvgIcon'
import styles from './legal-term-list.module.scss'
import { BlogCase } from '@/types/blogTypes'
import BlogItem from '@/components/blogItem/BlogItem'
import EmptyState from '@/components/EmptyState/EmptyState'
import { useSearchStore } from '@/stores/searchStore'
import { useNavigate } from 'react-router-dom'

const LegalTermBlogList = ({ blogList, termsName }: { blogList: BlogCase[]; termsName: string }) => {
  const { setSearchQuery, setSearchLawyerId } = useSearchStore()
  const navigate = useNavigate()

  const handleMore = () => {
    setSearchQuery(termsName)
    setSearchLawyerId(undefined)
    navigate(`/search/blog`)
  }

  return (
    <div className={styles.container}>
      <header className={`${styles['list-header']} ${styles['blog']}`}>
        <h3>법률정보의 글</h3>
        {blogList.length > 0 && (
          <button onClick={handleMore}>
            <span>더보기</span>
            <SvgIcon name='arrowSmall' style={{ transform: 'rotate(-90deg)' }} />
          </button>
        )}
      </header>
      <section className={styles['list-section']} style={{ paddingTop: 16 }}>
        {blogList.length === 0 ? (
          <EmptyState message='등록된 블로그 글이 없습니다.' />
        ) : (
          blogList.map(blog => <BlogItem key={blog.blogCaseId} item={blog} />)
        )}
      </section>
    </div>
  )
}

export default LegalTermBlogList
