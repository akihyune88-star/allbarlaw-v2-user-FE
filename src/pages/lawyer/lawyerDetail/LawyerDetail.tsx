import styles from './lawyer-detail.module.scss'
import LawyerAchievements from '@/container/lawyer/lawyerAchievements/LawyerAchievements'
import LawyerActivity from '@/container/lawyer/lawyerActivity/LawyerActivity'
import LawyerBlog from '@/container/lawyer/lawyerBlog/LawyerBlog'
import LawyerCareer from '@/container/lawyer/lawyerCareer/LawyerCareer'
import LawyerDetailSidebar from '@/container/lawyer/lawyerDetailSidebar/LawyerDetailSidebar'
import LawyerLegalKnowledge from '@/container/lawyer/lawyerLegalKnowledge/LawyerLegalKnowledge'
import LawyerProfile from '@/container/lawyer/lawyerProfile/LawyerProfile'
import LawyerVideo from '@/container/lawyer/lawyerVideo/LawyerVideo'
import { useLawyerDetail } from '@/hooks/queries/useLawyer'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'

const LawyerDetail = () => {
  const careerRef = useRef<HTMLElement>(null)
  const blogRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLElement>(null)
  const legalKnowledgeRef = useRef<HTMLElement>(null)
  const { lawyerId } = useParams()

  const { data: lawyerDetail } = useLawyerDetail(Number(lawyerId))

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    knowledgeIds: lawyerDetail?.consultationRequests.map(request => request.knowledgeId) ?? [],
    blogCaseIds: lawyerDetail?.blogCases.map(blog => blog.blogCaseId) ?? [],
    videoCaseIds: lawyerDetail?.videoCases.map(video => video.videoCaseId) ?? [],
  })

  const lawyerProfileImages = lawyerDetail?.lawyerProfileImages.map(image => image.imageUrl)

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LawyerProfile
          lawyerId={lawyerDetail?.lawyerId ?? 0}
          lawyerName={lawyerDetail?.lawyerName ?? ''}
          discription={lawyerDetail?.lawyerDescription ?? ''}
          lawyerLawfirm={lawyerDetail?.lawfirmName ?? ''}
          lawyerAdress={lawyerDetail?.lawfirmAddress ?? ''}
          lawfirmContact={lawyerDetail?.lawfirmContact ?? ''}
          tags={lawyerDetail?.tags ?? []}
        />
        <LawyerActivity statistics={lawyerDetail?.statistics ?? null} createdAt={lawyerDetail?.createdAt ?? ''} />
        <LawyerAchievements achievements={lawyerDetail?.achievements ?? []} />
        <section className={styles['lawyer-detail__button-container']}>
          <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(careerRef)}>
            이력사항 및 활동사항
          </button>
          <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(blogRef)}>
            <span>법률정보의 글</span>
            <span>(10)</span>
          </button>
          <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(videoRef)}>
            <span>법률영상</span>
            <span>(10)</span>
          </button>
          <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(legalKnowledgeRef)}>
            <span>법률지식인</span>
            <span>(10)</span>
          </button>
        </section>
        <LawyerCareer
          ref={careerRef}
          careerHistory={lawyerDetail?.careers ?? []}
          activities={lawyerDetail?.activities ?? []}
        />
        <LawyerBlog
          ref={blogRef}
          blogList={lawyerDetail?.blogCases ?? []}
          lawyerId={Number(lawyerId)}
          lawyerName={lawyerDetail?.lawyerName ?? ''}
        />
        <LawyerVideo
          ref={videoRef}
          videoList={lawyerDetail?.videoCases ?? []}
          lawyerId={Number(lawyerId)}
          lawyerName={lawyerDetail?.lawyerName ?? ''}
        />
        <LawyerLegalKnowledge
          ref={legalKnowledgeRef}
          knowledgeList={lawyerDetail?.consultationRequests ?? []}
          lawyerId={Number(lawyerId)}
          lawyerName={lawyerDetail?.lawyerName ?? ''}
        />
      </section>
      <aside className='aside'>
        <LawyerDetailSidebar
          lawyerId={lawyerDetail?.lawyerId ?? 0}
          lawyerName={lawyerDetail?.lawyerName ?? ''}
          lawyerLawfirm={lawyerDetail?.lawfirmName ?? ''}
          lawyerProfileImage={lawyerProfileImages ?? []}
          lawyerIsKeep={lawyerDetail?.isKeep!}
          recommendationLegalTerm={recommendationLegalTerm || []}
        />
      </aside>
    </main>
  )
}

export default LawyerDetail
