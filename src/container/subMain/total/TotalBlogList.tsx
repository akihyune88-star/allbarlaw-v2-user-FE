import Article from '@/components/article/Article'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import styles from '@/container/subMain/total/total-blog-list.module.scss'

const TotalBlogList = () => {
  return (
    <div className={styles['total-blog-list']}>
      <ArticleHeader title='변호사의 글' totalBlogCount={10} recentBlogCount={10} type='total' />
      <div className={styles['blog-list']}>
        <Article type='xsmall' title='블로그 제목' content='블로그 내용' category='부동산' />
      </div>
    </div>
  )
}

export default TotalBlogList
