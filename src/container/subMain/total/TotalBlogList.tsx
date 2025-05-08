import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Divider from '@/components/divider/Divider'
import styles from '@/pages/subMain/total-sub-main.module.scss'

const TotalBlogList = () => {
  return (
    <div className={styles['total-blog-list']}>
      <ArticleHeader
        title={`변호사의 영상을 보고
내 법률 문제의 해결방법을 찾으세요.`}
        totalBlogCount={10}
        recentBlogCount={10}
        type='section'
      />
      <Divider />
      <ArticleHeader title='변호사의 글' totalBlogCount={10} recentBlogCount={10} type='total' />
    </div>
  )
}

export default TotalBlogList
