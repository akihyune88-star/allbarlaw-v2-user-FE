import ArticleHeader from '@/components/articleHeader/ArticleHeader'

const TotalVideo = () => {
  return (
    <div>
      <ArticleHeader title='법률 영상' totalBlogCount={10} recentBlogCount={10} type='total' titleType='horizontal' />
    </div>
  )
}

export default TotalVideo
