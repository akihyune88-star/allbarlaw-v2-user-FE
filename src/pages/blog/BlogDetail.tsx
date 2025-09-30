import styles from '@/pages/blog/blog-detail.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'
import BlogDetailContents from '@/container/blog/BlogDetailContents'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import BlogDetailSideBar from '@/container/blog/BlogDetailSideBar'
import AILoading from '@/components/aiLoading/AILoading'
import { useGetBlogDetail } from '@/hooks/queries/useGetBlogDetail'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useDelayedLoading } from '@/hooks'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import { useBlogKeep } from '@/hooks/queries/useGetBlogList'
import React, { useState, useEffect } from 'react'
import { COLOR } from '@/styles/color'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import RecommendationLawyer from '@/container/recommendation/RecommendationLawyer'
import { setTemporaryItem } from '@/utils/temporaryStorage'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'
import { useAuth } from '@/contexts/AuthContext'
import ConfirmModal from '@/components/modal/ConfirmModal'

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

const BlogDetail = ({ className }: { className?: string }) => {
  const { blogCaseId } = useParams<{ blogCaseId: string }>()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const { showLoading, setShowLoading } = useDelayedLoading({ delay: 3000 })
  const { data } = useGetBlogDetail({ blogCaseId: Number(blogCaseId) })
  const [isKeep, setIsKeep] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const navigate = useNavigate()

  const { isLoggedIn } = useAuth()

  // blogCaseId가 변경될 때마다 로딩 다시 시작
  useEffect(() => {
    setShowLoading(true)
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [blogCaseId, setShowLoading])

  // data가 로드되면 isKeep 상태 업데이트
  useEffect(() => {
    if (data?.isKeep !== undefined) {
      setIsKeep(data.isKeep)
    }
  }, [data?.isKeep])

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
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const lawyer = {
    lawyerId: data?.lawyerId || 0,
    name: data?.lawyerName || '',
    lawfirm: data?.lawfirmName || '',
    profileImage: data?.lawyerProfileImage || '',
  }

  const handleShare = () => {
    copyUrlToClipboard()
  }

  const handleSave = () => {
    // 로그인 체크
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    if (data?.blogCaseId) {
      // 낙관적 업데이트: 즉시 UI 변경
      setIsKeep(prevState => !prevState)
      changeBlogKeep(data.blogCaseId)
    }
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    navigate(ROUTER.AUTH)
  }

  const handleLawyerClick = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
  }

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    blogCaseIds: [data?.blogCaseId || 0],
  })

  const handleBaroTalk = (e: React.MouseEvent, lawyerId: number) => {
    e.stopPropagation() // 이벤트 버블링 방지
    if (lawyerId) {
      setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30) // 30분 유효
      navigate(ROUTER.REQUEST_BARO_TALK)
    }
  }

  const handleBlogLink = () => {
    window.open(data?.source || '', '_blank')
  }

  return (
    <div className={`detail-container ${className}`}>
      <DetailHeader title={data?.title || ''} onShare={handleShare} onSave={handleSave} isKeep={isKeep} />

      <ConfirmModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
        message='로그인 후 이용할 수 있습니다.'
        confirmText='확인'
        cancelText='취소'
      />

      <div className={'detail-body'}>
        <div>
          {showLoading ? (
            <AILoading title='AI가 해당 블로그의 포스팅글을 분석중입니다.' />
          ) : (
            <>
              <BlogDetailContents summaryContents={data?.summaryContent || ''} tagList={data?.tags || []} />
              <BlogNavigationBar
                isKeep={isKeep}
                onSave={handleSave}
                onShare={handleShare}
                onBlogLink={handleBlogLink}
              />
              {!isMobile ? (
                <div style={{ width: 798 }}>
                  <AIBlogCarousel subcategoryId={subcategoryId ? Number(subcategoryId) : 'all'} take={10} />
                </div>
              ) : (
                <div className={styles['blog-moblie-side']}>
                  <LawyerHorizon
                    className={styles['lawyer-horizon']}
                    lawyerId={lawyer.lawyerId}
                    name={lawyer.name}
                    description='법률사무소 바로'
                    profileImage={lawyer.profileImage}
                    buttonComponent={
                      <div className={styles['lawyer-contact-btn-wrapper']}>
                        <button onClick={() => handleLawyerClick(lawyer.lawyerId)}>변호사 정보</button>
                        <button onClick={e => handleBaroTalk(e, lawyer.lawyerId)}>바로톡</button>
                      </div>
                    }
                  />
                  <AIBlogCarousel subcategoryId={subcategoryId ? Number(subcategoryId) : 'all'} take={10} />
                  <RecommendationLawyer />
                </div>
              )}
            </>
          )}
        </div>
        {!isMobile && (
          <BlogDetailSideBar
            blogCaseId={Number(blogCaseId)}
            showLoading={showLoading}
            lawyer={lawyer || {}}
            recommendationLegalTerm={recommendationLegalTerm}
          />
        )}
      </div>
    </div>
  )
}

export default BlogDetail
