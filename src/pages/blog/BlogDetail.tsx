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
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import { useBlogKeep } from '@/hooks/queries/useGetBlogList'
import { useState, useEffect } from 'react'
import { COLOR } from '@/styles/color'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { useRecommendationLawyer, useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import { useChunkedRotate } from '@/hooks/useChunkedRotate'
import RecommendationLawyer from '@/container/recommendation/RecommendationLawyer'

type BlogNavigationBarProps = {
  isKeep: boolean
  onSave: () => void
  onShare: () => void
}

const BlogNavigationBar = ({ isKeep, onSave, onShare }: BlogNavigationBarProps) => {
  return (
    <div className={styles['blog-navigation-bar']}>
      <button className={styles['blog-link-btn']}>블로그 바로가기</button>
      <div className={styles['button-wrapper']}>
        <Button variant='share' onClick={onShare}>
          공유
          <SvgIcon name='share' size={16} />
        </Button>
        <Button variant='save' onClick={onSave}>
          저장 <SvgIcon name='save' size={16} fill={isKeep ? COLOR.icon_darkgreen : 'none'} />
        </Button>
      </div>
    </div>
  )
}

const BlogDetail = ({ className }: { className?: string }) => {
  const { showLoading } = useDelayedLoading({ delay: 3000 })
  const { blogCaseId } = useParams<{ blogCaseId: string }>()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const { data } = useGetBlogDetail({ blogCaseId: Number(blogCaseId) })
  const [isKeep, setIsKeep] = useState(false)
  const navigate = useNavigate()
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
    if (data?.blogCaseId) {
      // 낙관적 업데이트: 즉시 UI 변경
      setIsKeep(prevState => !prevState)
      changeBlogKeep(data.blogCaseId)
    }
  }

  const handleLawyerClick = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
  }

  const { data: recommendationLawyer } = useRecommendationLawyer(10)
  const { visibleItems: displayLawyers, rotateNext: handleRefreshRecommendLawyer } = useChunkedRotate(
    recommendationLawyer ?? [],
    3
  )

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    blogCaseIds: [data?.blogCaseId || 0],
  })

  return (
    <div className={`detail-container ${className}`}>
      <DetailHeader title={data?.title || ''} onShare={handleShare} onSave={handleSave} isKeep={isKeep} />
      <div className={'detail-body'}>
        <div>
          {showLoading ? (
            <AILoading title='AI가 해당 블로그의 포스팅글을 분석중입니다.' />
          ) : (
            <>
              <BlogDetailContents summaryContents={data?.summaryContent || ''} tagList={data?.tags || []} />
              <BlogNavigationBar isKeep={isKeep} onSave={handleSave} onShare={handleShare} />
              {!isMobile ? (
                <div style={{ width: 798 }}>
                  <AIBlogCarousel subcategoryId={subcategoryId ? Number(subcategoryId) : 'all'} take={4} />
                </div>
              ) : (
                <div className={styles['blog-moblie-side']}>
                  <LawyerHorizon
                    className={styles['lawyer-horizon']}
                    name={lawyer.name}
                    description='법률사무소 바로'
                    profileImage={lawyer.profileImage}
                    buttonComponent={
                      <div className={styles['lawyer-contact-btn-wrapper']}>
                        <button onClick={() => handleLawyerClick(lawyer.lawyerId)}>변호사 정보</button>
                        <button>바로톡</button>
                      </div>
                    }
                  />
                  <AIBlogCarousel subcategoryId={subcategoryId ? Number(subcategoryId) : 'all'} take={4} />
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

const mockLawyerList = [
  {
    lawyerId: 1,
    lawyerName: '이보람',
    lawfirmName: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    lawyerProfileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    lawyerId: 2,
    lawyerName: '이보람',
    lawfirmName: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    lawyerProfileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    lawyerId: 1,
    lawyerName: '이보람',
    lawfirmName: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    lawyerProfileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
]
