import styles from './lawyerBlogDetail.module.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetBlogDetail } from '@/hooks/queries/useGetBlogDetail'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import BlogDetailContents from '@/container/blog/BlogDetailContents'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { useBlogKeep } from '@/hooks/queries/useGetBlogList'
import { useState } from 'react'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'
import { ROUTER } from '@/routes/routerConstant'

type BlogNavigationBarProps = {
  isKeep: boolean
  onSave: () => void
  onShare: () => void
  onBlogLink: () => void
}

const BlogNavigationBar = ({ isKeep, onSave, onShare, onBlogLink }: BlogNavigationBarProps) => {
  return (
    <div className={styles['blog-navigation-bar']}>
      <button className={styles['blog-link-btn']} onClick={onBlogLink}>
        블로그 바로가기
      </button>
      <div className={styles['button-wrapper']}>
        <Button variant='share' onClick={onShare}>
          공유
          <SvgIcon name='share' size={16} style={{ cursor: 'pointer' }} />
        </Button>
        <Button variant='save' onClick={onSave}>
          저장{' '}
          <SvgIcon name='save' size={16} fill={isKeep ? COLOR.icon_darkgreen : 'none'} style={{ cursor: 'pointer' }} />
        </Button>
      </div>
    </div>
  )
}

const LawyerBlogDetail = () => {
  const { blogCaseId } = useParams<{ blogCaseId: string }>()
  const navigate = useNavigate()
  const { data } = useGetBlogDetail({ blogCaseId: Number(blogCaseId) })
  const { data: lawyerBasicInfo } = useLawyerDetailForMe()
  const [isKeep, setIsKeep] = useState(false)
  const { mutate: changeBlogKeep } = useBlogKeep({
    onSuccess: data => {
      // 서버 응답으로 최종 상태 확인
      setIsKeep(data.isKeep)
    },
    onError: () => {
      console.error('Failed to change blog keep')
      // 에러 발생 시 원래 상태로 롤백
      setIsKeep(prevState => !prevState)
    },
  })

  const handleShare = () => {
    copyUrlToClipboard()
  }

  const handleSave = () => {
    if (data?.blogCaseId) {
      // 낙관적 업데이트: 즉시 UI 변경
      setIsKeep(prevState => !prevState)
      changeBlogKeep(data.blogCaseId)
    }
  }

  const handleBlogLink = () => {
    window.open(data?.source || '', '_blank')
  }

  const handleExcelUpload = () => {
    console.log('ExcelUpload')
  }

  const handleDirectUpload = () => {
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_BLOG_EDIT)
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>{lawyerBasicInfo?.lawyerName}변호사님이 등록한 블로그 글입니다.</h1>
          <div className={styles.headerButtonWrapper}>
            <button type='button' onClick={handleExcelUpload}>
              블로그 글 등록(Excel)
            </button>
            <button type='button' onClick={handleDirectUpload}>
              블로그 글 등록(직접)
            </button>
          </div>
        </div>
      </HeaderPortal>
      <div className={styles['lawyer-blog-detail']}>
        <DetailHeader title={data?.title || ''} className={styles['lawyer-blog-detail-header']} />
        <BlogDetailContents
          summaryContents={data?.summaryContent || ''}
          tagList={data?.tags || []}
          className={styles['lawyer-blog-detail-contents']}
        />
        <BlogNavigationBar isKeep={isKeep} onSave={handleSave} onShare={handleShare} onBlogLink={handleBlogLink} />
      </div>
    </>
  )
}

export default LawyerBlogDetail
