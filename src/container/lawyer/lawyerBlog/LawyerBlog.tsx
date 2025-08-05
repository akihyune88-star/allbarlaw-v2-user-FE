import Divider from '@/components/divider/Divider'
import styles from './lawyerBlog.module.scss'
import { useGetBlogList } from '@/hooks/queries/useGetBlogList'
import BlogItem from '@/components/blogItem/BlogItem'
import SvgIcon from '@/components/SvgIcon'
import { forwardRef } from 'react'

const LawyerBlog = forwardRef<HTMLElement>((_, ref) => {
  const { blogList } = useGetBlogList({
    subcategoryId: 'all',
    take: 3,
  })

  const threeBlogList = blogList.slice(0, 3)

  return (
    <section ref={ref} className={styles['lawyer-blog']} aria-label='변호사의 글'>
      <header className={styles['lawyer-blog__header']}>
        <h3 className={styles['lawyer-blog__title']}>변호사의 글</h3>
        <button type='button' className={styles['lawyer-blog__button']} aria-label='변호사의 글 더보기'>
          더보기
          <SvgIcon name='arrowSmall' className={styles['lawyer-blog__button-icon']} size={14} />
        </button>
      </header>
      <Divider padding={14} />
      <ul className={styles['lawyer-blog__list']} role='list'>
        {threeBlogList.map((blog, index) => (
          <li key={blog.blogCaseId}>
            <BlogItem item={blog} type='small' />
            {index !== threeBlogList.length - 1 && <Divider padding={12} className={styles['lawyer-blog__divider']} />}
          </li>
        ))}
      </ul>
    </section>
  )
})

LawyerBlog.displayName = 'LawyerBlog'

export default LawyerBlog
