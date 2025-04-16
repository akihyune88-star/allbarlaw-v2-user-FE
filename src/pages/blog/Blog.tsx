import styles from '@/pages/blog/bolg.module.scss'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import BlogList from '@/container/blog/BlogList'

const BlogLayout = () => {
  return (
    <main className={styles['blog-container']}>
      <section className={styles['blog-section']}>
        <AIBlogCarousel />
        <BlogList />
      </section>
      <aside>
        <section>
          <span>추천태그 /변호사</span>
        </section>
        <section>
          <span>법률사전</span>
        </section>
      </aside>
    </main>
  )
}

export default BlogLayout
