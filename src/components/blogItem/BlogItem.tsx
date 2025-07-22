import { BlogCase } from '@/types/blogTypes'
import { getBlogSummaryText } from '@/utils/blogTextFormatter'
import styles from '@/components/blogItem/blog-item.module.scss'
import SvgIcon from '../SvgIcon'
import { useState } from 'react'
import { COLOR } from '@/styles/color'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type BlogItemProps = {
  item: BlogCase
  viewKeepBookmark?: boolean
  className?: string
  onClick?: () => void
}

const BlogItem = ({ item, viewKeepBookmark = false, className, onClick }: BlogItemProps) => {
  const [like, setLike] = useState(false)
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const summaryContents = getBlogSummaryText(item.summaryContent)

  return (
    <article className={`${styles['blog-item-wrapper']} ${className}`} onClick={onClick}>
      <div className={styles['blog-item']}>
        <div className={styles['blog-content-header']}>
          <h3>{item.title}</h3>
          {viewKeepBookmark && !isMobile && (
            <SvgIcon name='bookMark' onClick={() => setLike(!like)} fill={like ? COLOR.green_01 : 'none'} />
          )}
        </div>
        <div className={styles['blog-content-body']}>
          <p>{summaryContents}</p>
          <div className={styles['blog-content-footer']}>
            <span className={styles.lawyer}>{item.lawyerName} 변호사</span>
            <span className={styles.lawfirm}>[{item.lawfirmName}]</span>
            {viewKeepBookmark && isMobile && (
              <SvgIcon
                name='bookMark'
                onClick={() => setLike(!like)}
                fill={like ? COLOR.green_01 : 'none'}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </div>
        </div>
      </div>
      <figure>
        <img
          className={styles['blog-item-img']}
          src={item.thumbnail}
          alt='blog-item-image'
          referrerPolicy='no-referrer'
        />
      </figure>
    </article>
  )
}

export default BlogItem
