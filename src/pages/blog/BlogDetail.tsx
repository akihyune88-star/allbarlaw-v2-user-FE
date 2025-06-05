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
import { useMediaQuery } from '@/hooks/useMediaQuery'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'

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

  const isMobile = useMediaQuery('(max-width: 80rem)')

  const lawyer = {
    id: data?.lawyerId || '',
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
              {!isMobile ? (
                <AIBlogCarousel />
              ) : (
                <div className={styles['blog-moblie-side']}>
                  <LawyerHorizon
                    className={styles['lawyer-horizon']}
                    name={lawyer.name}
                    description='법률사무소 바로'
                    profileImage={lawyer.profileImage}
                    buttonComponent={
                      <div className={styles['lawyer-contact-btn-wrapper']}>
                        <button>변호사 정보</button>
                        <button>바로톡</button>
                      </div>
                    }
                  />
                  <ContentsRecommender
                    isRefresh={true}
                    title='AI 추천 변호사'
                    contents={
                      <div className={styles['ai-recommender-lawyer']}>
                        {mockLawyerList.map(lawyer => (
                          <LawyerHorizon
                            key={lawyer.id}
                            name={lawyer.name}
                            profileImage={lawyer.profileImage}
                            description={lawyer.description}
                            size='x-small'
                          />
                        ))}
                      </div>
                    }
                  />
                  <LegalTermWidget
                    lagalTermList={[
                      '사기죄 [詐欺罪]',
                      '업무방해죄 [業務妨害罪]',
                      '절도죄 [窃盜罪]',
                      '법정대리인 [法定代理人]',
                      '위법성 조각사유 [違法性 阻却事由]',
                    ]}
                  />
                </div>
              )}
            </>
          )}
        </div>
        {!isMobile && (
          <BlogDetailSideBar showLoading={showLoading} lawyer={lawyer || {}} recommendLawyerList={mockLawyerList} />
        )}
      </div>
    </div>
  )
}

export default BlogDetail

const mockLawyerList = [
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
]
