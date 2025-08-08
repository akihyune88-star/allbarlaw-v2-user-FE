import { BlogCase } from '@/types/blogTypes'
import { getBlogSummaryText } from '@/utils/blogTextFormatter'
import styles from '@/components/blogItem/blog-item.module.scss'
import SvgIcon from '../SvgIcon'
import React, { useState } from 'react'
import { COLOR } from '@/styles/color'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useAuth } from '@/contexts/AuthContext'
import { useBlogKeep } from '@/hooks/queries/useGetBlogList'

type BlogItemProps = {
  type?: 'small' | 'regular'
  item: BlogCase
  className?: string
  summaryButton?: boolean
  isShowKeep?: boolean
  onClick?: () => void
}

const BlogItem = ({
  item,
  type = 'regular',
  className,
  summaryButton = false,
  isShowKeep = true,
  onClick,
}: BlogItemProps) => {
  const [isKeep, setIsKeep] = useState(item.isKeep)
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { isLoggedIn } = useAuth()
  const summaryContents = getBlogSummaryText(item.summaryContent)

  const { mutate: changeBlogKeep } = useBlogKeep({
    onSuccess: data => {
      // 서버 응답을 무시하고 클라이언트 상태 유지
      // setIsKeep(data.isKeep)
    },
    onError: () => {
      // 에러 시에만 롤백
      setIsKeep(prevState => !prevState)
    },
  })

  const handleBlogKeep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    // 낙관적 업데이트: 즉시 UI 변경
    setIsKeep(prevState => !prevState)
    changeBlogKeep(item.blogCaseId)
  }

  return (
    <article className={`${styles['blog-item-wrapper']} ${styles[type]} ${className || ''}`} onClick={onClick}>
      <div className={styles['blog-item']}>
        <div className={styles['blog-content-header']}>
          <h3>{item.title}</h3>
          {isLoggedIn && !isMobile && isShowKeep && (
            <button onClick={e => handleBlogKeep(e)} className={styles['blog-item-keep-btn']}>
              <SvgIcon name='bookMark' fill={isKeep ? COLOR.green_01 : 'none'} />
            </button>
          )}
        </div>
        <div className={styles['blog-content-body']}>
          <p>{summaryContents}</p>
          <div className={styles['blog-content-footer']}>
            <span className={styles.lawyer}>{item.lawyerName} 변호사</span>
            <span className={styles.lawfirm}>[{item.lawfirmName}]</span>
            {isLoggedIn && isMobile && isShowKeep && (
              <button onClick={e => handleBlogKeep(e)} className={styles['blog-item-keep-btn']}>
                <SvgIcon name='bookMark' fill={isKeep ? COLOR.green_01 : 'none'} style={{ marginLeft: 'auto' }} />
              </button>
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
        {summaryButton && !isMobile && <label htmlFor='blog-item-img'>요약보기</label>}
      </figure>
    </article>
  )
}

export default BlogItem
