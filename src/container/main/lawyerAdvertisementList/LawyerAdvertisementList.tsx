import { useState, useEffect, useRef } from 'react'
import PlayButton from '@/components/playButton/PlayButton'
import styles from './lawyer-advertisement-list.module.scss'
import { COLOR } from '@/styles/color'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SOCIAL_LINK_LIST } from '@/constants/lawyer'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import { useLawyerCount, useRandomLawyerList } from '@/hooks/queries/useLawyer'
import { useNavigationHistory } from '@/hooks'
import { Lawyer } from '@/types/lawyerTypes'
import SvgIcon from '@/components/SvgIcon'
import { useNavigate } from 'react-router-dom'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'

const LawyerAdvertisementListHeader = ({
  onNext,
  onPrev,
  onToggle,
  isPlaying,
  refetch,
}: {
  onNext?: () => void
  onPrev?: () => void
  onToggle?: () => void
  isPlaying?: boolean
  refetch?: () => void
}) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { data: lawyerCount } = useLawyerCount({
    subcategoryId: 'all',
    recentDays: 'all',
  })
  return (
    <header className={styles['lawyer-advertisement-list-header']}>
      <div className={styles['text-wrapper']}>
        <h4 className={styles['title']}>함께 시작하는 전문 변호사</h4>
        <span className={styles['sub-title']}>전체 {lawyerCount?.toLocaleString()}명의 전문 변호사가 함께 합니다.</span>
      </div>
      {!isMobile ? (
        <PlayButton
          iconColor={COLOR.text_black}
          onNext={onNext}
          onPrev={onPrev}
          onToggle={onToggle}
          isPlaying={isPlaying}
        />
      ) : (
        <SvgIcon name='refresh' size={16} onClick={refetch} style={{ cursor: 'pointer' }} />
      )}
    </header>
  )
}

const LawyerAdvertisementList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<number | null>(null)

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev } = useNavigationHistory()

  const { lawyerList, hasNextPage, refetch } = useRandomLawyerList({
    subcategoryId: 'all',
    take: isMobile ? 3 : 4,
    excludeIds: currentExcludeIds,
  })

  const handleClickNext = () => {
    if (lawyerList && lawyerList.length > 0) {
      const currentIds = lawyerList.map(lawyer => lawyer.lawyerId)
      handleNext(currentIds)
    }
  }

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  useEffect(() => {
    if (isPlaying && !isMobile) {
      intervalRef.current = window.setInterval(() => {
        handleClickNext()
      }, 3000)
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, hasNextPage, lawyerList, isMobile])

  const handleLawyerClick = (lawyer: Lawyer) => {
    navigate(`/search/lawyer/${lawyer.lawyerId}?q=${lawyer.lawyerName}`)
  }

  const handleBaroTalk = (lawyerId: number) => {
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  return (
    <section className={styles['container']}>
      <LawyerAdvertisementListHeader
        onNext={hasNextPage ? handleClickNext : undefined}
        onPrev={canGoPrev ? handlePrev : undefined}
        onToggle={handleTogglePlay}
        isPlaying={isPlaying}
        refetch={refetch}
      />

      <div className={styles['lawyer-list']}>
        {lawyerList.map(lawyer =>
          isMobile ? (
            <LawyerHorizon
              className={styles['lawyer-horizon']}
              lawyerId={lawyer.lawyerId}
              key={lawyer.lawyerId}
              name={lawyer.lawyerName}
              lawfirm={lawyer.lawfirmName}
              socialLink={SOCIAL_LINK_LIST}
              profileImage={lawyer.lawyerProfileImage}
              tags={lawyer.tags}
              buttonComponent={
                <div className={styles['footer']}>
                  <button
                    className={`${styles['footer-button']} ${styles['left']}`}
                    onClick={() => handleLawyerClick(lawyer)}
                  >
                    더보기
                  </button>
                  <button
                    className={`${styles['footer-button']} ${styles['left']}`}
                    onClick={() => handleBaroTalk(lawyer.lawyerId)}
                  >
                    바로톡
                  </button>
                </div>
              }
            />
          ) : (
            <LawyerVertical
              lawyerId={lawyer.lawyerId}
              key={lawyer.lawyerId}
              className={styles['custom-lawyer-vertical']}
              name={lawyer.lawyerName}
              profileImage={lawyer.lawyerProfileImage}
              type={1}
              blogUrl={lawyer.lawyerBlogUrl}
              youtubeUrl={lawyer.lawyerYoutubeUrl}
              instagramUrl={lawyer.lawyerInstagramUrl}
              tags={lawyer.tags}
              footer={
                <div className={styles['footer']}>
                  <button
                    className={`${styles['footer-button']} ${styles['left']}`}
                    onClick={() => handleLawyerClick(lawyer)}
                  >
                    더보기
                  </button>
                  <button
                    className={`${styles['footer-button']} ${styles['right']}`}
                    onClick={() => handleBaroTalk(lawyer.lawyerId)}
                  >
                    바로톡
                  </button>
                </div>
              }
            />
          )
        )}
      </div>
    </section>
  )
}

export default LawyerAdvertisementList
