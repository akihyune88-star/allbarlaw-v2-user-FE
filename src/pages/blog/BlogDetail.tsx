import { useEffect, useState } from 'react'
import styles from '@/pages/blog/blog-detail.module.scss'
import { BlogCase } from '@/types/blogTypes'
import { useLocation } from 'react-router-dom'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'

type BlogHeaderProps = {
  title: string
}
// type BlogDetailContentProps = {}
// type BlogDetailSideBarProps = {}

const AILoading = () => {
  return (
    <div className={styles['skeleton-container']}>
      <div className={styles['skeleton-header']}>
        <span>AI가 해당 블로그의 포스팅글을 분석중입니다.</span>
      </div>
      <div className={styles['skeleton-content']}>
        <div className={styles['skeleton-paragraph']} style={{ width: 149 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 269 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 169 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 238 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 149 }} />
      </div>
    </div>
  )
}

const BlogDetailHeader = ({ title }: BlogHeaderProps) => {
  console.log(title)

  return (
    <div className={styles['blog-detail-header']}>
      <h1>{title}</h1>
      <div className={styles['button-wrapper']}>
        <Button variant='share'>
          공유
          <SvgIcon name='share' size={16} />
        </Button>
        <Button variant='save'>
          저장 <SvgIcon name='save' size={16} />
        </Button>
      </div>
    </div>
  )
}

const BlogDetailContent = () => {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return <div className={styles['blog-detail-content']}>{showLoading ? <AILoading /> : <div>로딩 완료</div>}</div>
}

const BlogDetailSideBar = () => {
  return <div className={styles['blog-detail-side-bar']}>블로그디테일사이드바</div>
}

const BlogDetail = () => {
  const { state } = useLocation()
  const { blogItem } = state as { blogItem: BlogCase }

  return (
    <div className={styles['blog-detail-container']}>
      <BlogDetailHeader title={blogItem.title} />
      <div className={styles['blog-detail-body']}>
        <BlogDetailContent />
        <BlogDetailSideBar />
      </div>
    </div>
  )
}

export default BlogDetail
