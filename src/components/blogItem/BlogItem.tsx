import { BlogCase } from '@/types/blogTypes'
import { getBlogSummaryText } from '@/utils/blogTextFormatter'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '@/components/blogItem/blog-item.module.scss'
import SvgIcon from '../SvgIcon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useState } from 'react'
import { COLOR } from '@/styles/color'
const BlogItem = ({ item }: { item: BlogCase }) => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { categoryId } = useParams()
  const [like, setLike] = useState(false)

  const summaryContents = getBlogSummaryText(item.summaryContent)

  const handleClick = () => {
    const path = categoryId ? `/${categoryId}/blog/${item.id}` : `/blog/${item.id}`

    navigate(path, {
      state: { blogItem: item },
    })
  }

  return (
    <article className={styles['blog-item-wrapper']} onClick={handleClick}>
      <div className={styles['blog-item']}>
        <div className={styles['blog-content-header']}>
          <h3>{item.title}</h3>
          {!isMobile && (
            <SvgIcon name='bookMark' onClick={() => setLike(!like)} fill={like ? COLOR.green_01 : 'none'} />
          )}
        </div>
        <div className={styles['blog-content-body']}>
          <p>{summaryContents}</p>
          <span className={styles.lawyer}>{item.lawyerName} 변호사</span>{' '}
          <span className={styles.lawfirm}>[{item.lawfirmName}]</span>
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
