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
import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'

const LawyerDetail = () => {
  const careerRef = useRef<HTMLElement>(null)
  const blogRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLElement>(null)
  const legalKnowledgeRef = useRef<HTMLElement>(null)
  const { lawyerId } = useParams()

  const { data: lawyerDetail } = useLawyerDetail(Number(lawyerId))
  console.log(lawyerDetail)

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LawyerProfile
          discription={lawyerDetail?.lawyerDescription ?? ''}
          lawyerLawfirm={lawyerDetail?.lawfirmName ?? ''}
          lawyerAdress={lawyerDetail?.lawfirmAddress ?? ''}
          tags={lawyerDetail?.tags?.map(tag => ({ id: Math.random(), name: tag })) ?? []}
        />
        <LawyerActivity statistics={lawyerDetail?.statistics ?? null} createdAt={lawyerDetail?.createdAt ?? ''} />
        <LawyerAchievements achievements={lawyerDetail?.achievements ?? []} />
        <section className={styles['lawyer-detail__button-container']}>
          <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(careerRef)}>
            이력사항 및 활동사항
          </button>
          <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(blogRef)}>
            <span>변호사의 글</span>
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
        <LawyerCareer ref={careerRef} />
        <LawyerBlog ref={blogRef} />
        <LawyerVideo ref={videoRef} />
        <LawyerLegalKnowledge ref={legalKnowledgeRef} />
      </section>
      <aside className='aside'>
        <LawyerDetailSidebar />
      </aside>
    </main>
  )
}

export default LawyerDetail
