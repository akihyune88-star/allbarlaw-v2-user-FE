import AiRecommenderContentSlider from '@/components/slider/AiRecommenderContentSlider'
import styles from './ai-blog-carousel.module.scss'
import { useRecommendationBlog } from '@/hooks/queries/useRecommendation'
import { BlogCase } from '@/types/blogTypes'
import { useNavigate } from 'react-router-dom'

const AIBlogCarousel = ({ subcategoryId, take }: { subcategoryId: number | 'all'; take: number }) => {
  const { data: recommendationBlog } = useRecommendationBlog({
    subcategoryId,
    take,
  })

  const navigate = useNavigate()

  const handleBlogItemClick = (blog: BlogCase) => {
    navigate(`/${blog.subcategoryId}/blog/${blog.blogCaseId}`)
  }

  return (
    <AiRecommenderContentSlider title='AI 추천글' autoPlay={true}>
      {recommendationBlog?.map(blog => (
        <div key={blog.blogCaseId} className={styles['blog-item']} onClick={() => handleBlogItemClick(blog)}>
          <h3 className={styles['blog-title']}>{blog.title}</h3>
          <p className={styles['blog-summary']}>{blog.summaryContent}</p>
        </div>
      ))}
    </AiRecommenderContentSlider>
  )
}

export default AIBlogCarousel
