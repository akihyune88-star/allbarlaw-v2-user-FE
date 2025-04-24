import { BlogCase } from '@/types/blogTypes'
import { getBlogSummaryText } from '@/utils/blogTextFormatter'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '@/components/blogItem/blog-item.module.scss'
import Tag from '../tag/Tag'

const BlogItem = ({ item }: { item: BlogCase }) => {
  const navigate = useNavigate()
  const { categoryId } = useParams()

  const summaryContents = getBlogSummaryText(item.summaryContents)

  const handleClick = () => {
    const path = categoryId ? `/${categoryId}/blog/${item.id}` : `/blog/${item.id}`

    navigate(path, {
      state: { blogItem: item },
    })
  }

  return (
    <article className={styles['blog-item']} onClick={handleClick}>
      <div className={styles['blog-content']}>
        <h3>{item.title}</h3>
        <p>{summaryContents}</p>
        <span className={styles.lawyer}>{item.lawyer} 변호사</span>{' '}
        <span className={styles.lawfirm}>[{item.lawfirm}]</span>
        <div className={styles['blog-item-tag']}>
          <Tag tag='재산범죄' />
          <Tag tag='형사기타' />
          <Tag tag='사기' />
        </div>
      </div>
      <figure>
        <img
          className={styles['blog-item-img']}
          src='https://www.monthlypeople.com/news/photo/202003/21217_12862_5312.png'
          alt='blog-item-image'
        />
      </figure>
    </article>
  )
}

export default BlogItem
