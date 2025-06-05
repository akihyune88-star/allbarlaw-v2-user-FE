import styles from '@/pages/blog/blog-detail.module.scss'
import { useParams } from 'react-router-dom'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'
import BlogDetailContents from '@/container/blog/BlogDetailContents'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import BlogDetailSideBar from '@/container/blog/BlogDetailSideBar'
import { useEffect, useState } from 'react'
import AILoading from '@/components/aiLoading/AILoading'
import { useGetBlogDetail } from '@/hooks/queries/useGetBlogDetail'

type BlogHeaderProps = {
  title: string
}

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

const BlogDetail = () => {
  const [showLoading, setShowLoading] = useState(true)
  const { blogCaseId } = useParams<{ blogCaseId: string }>()
  const { data } = useGetBlogDetail({ blogCaseId: Number(blogCaseId) })

  const lawyer = {
    name: data?.lawyerName || '',
    lawfirm: data?.lawfirmName || '',
    profileImage: data?.lawyerProfileImage || '',
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles['blog-detail-container']}>
      <BlogDetailHeader title={data?.title || ''} />
      <div className={styles['blog-detail-body']}>
        <div>
          {showLoading ? (
            <AILoading />
          ) : (
            <>
              <BlogDetailContents summaryContents={data?.summaryContent || ''} tagList={data?.tags || []} />
              <BlogNavigationBar />
              <AIBlogCarousel />
            </>
          )}
        </div>
        <BlogDetailSideBar showLoading={showLoading} lawyer={lawyer || {}} />
      </div>
    </div>
  )
}

export default BlogDetail
