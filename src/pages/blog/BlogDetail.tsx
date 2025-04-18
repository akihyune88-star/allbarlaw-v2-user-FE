import styles from '@/pages/blog/blog-detail.module.scss'
import { BlogCase } from '@/types/blogTypes'
import { useLocation } from 'react-router-dom'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'
import BlogDetailContents from '@/container/blog/BlogDetailContents'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'

type BlogHeaderProps = {
  title: string
}
// type BlogDetailSideBarProps = {}

const BlogDetailHeader = ({ title }: BlogHeaderProps) => {
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

const BlogNavigationBar = () => {
  return (
    <div className={styles['blog-navigation-bar']}>
      <button className={styles['blog-link-btn']}>블로그 바로가기</button>
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
        <div>
          <BlogDetailContents summaryContents={blogItem.summaryContents} tagList={blogItem.tagList} />
          <BlogNavigationBar />
          <AIBlogCarousel />
        </div>
        <BlogDetailSideBar />
      </div>
    </div>
  )
}

export default BlogDetail
