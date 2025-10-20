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
  const [slideIndex, setSlideIndex] = useState(0) // 현재 슬라이드 인덱스 (0부터 시작)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev, reset } = useNavigationHistory()

  const itemsPerView = isMobile ? 3 : 4
  const totalFetchCount = itemsPerView * 3 // 한번에 12개 (또는 9개) 미리 받기

  // 현재 데이터 (더 많이 받기)
  const { lawyerList: currentLawyers, hasNextPage, refetch } = useRandomLawyerList({
    subcategoryId: 'all',
    take: totalFetchCount,
    excludeIds: currentExcludeIds,
  })

  // 다음 데이터 미리 fetching
  const nextExcludeIds = [...currentExcludeIds, ...currentLawyers.map(lawyer => lawyer.lawyerId)]
  const { lawyerList: nextLawyers } = useRandomLawyerList({
    subcategoryId: 'all',
    take: totalFetchCount,
    excludeIds: nextExcludeIds,
    enabled: hasNextPage && currentLawyers.length > 0,
  })

  // 전체 슬라이드 데이터 (현재 + 다음) - 중복 제거
  const allLawyers = [...currentLawyers, ...nextLawyers].filter(
    (lawyer, index, self) => self.findIndex(l => l.lawyerId === lawyer.lawyerId) === index
  )
  const maxSlideIndex = Math.max(0, allLawyers.length - itemsPerView)

  const handleClickNext = () => {
    if (isTransitioning) return

    if (slideIndex >= maxSlideIndex) {
      // 끝에 도달하면 더 많은 데이터 가져오기
      if (hasNextPage) {
        const currentIds = currentLawyers.map(lawyer => lawyer.lawyerId)
        handleNext(currentIds)
        setSlideIndex(0) // 새 데이터로 리셋
      } else {
        // 더 이상 데이터가 없으면 처음부터
        reset()
        setSlideIndex(0)
      }
    } else {
      // 한 칸 이동
      setIsTransitioning(true)
      setSlideIndex(prev => prev + 1)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }

  const handleClickPrev = () => {
    if (isTransitioning) return

    if (slideIndex > 0) {
      // 한 칸 뒤로
      setIsTransitioning(true)
      setSlideIndex(prev => prev - 1)
      setTimeout(() => setIsTransitioning(false), 500)
    } else if (canGoPrev) {
      // 이전 데이터 세트로
      handlePrev()
      setSlideIndex(0)
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
  }, [isPlaying, slideIndex, allLawyers, isMobile, hasNextPage])

  const handleLawyerClick = (lawyer: Lawyer) => {
    navigate(`/search/lawyer/${lawyer.lawyerId}?q=${lawyer.lawyerName}`)
  }

  const handleBaroTalk = (lawyerId: number) => {
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  // 각 아이템 너비 + 갭
  const itemWidth = isMobile ? 0 : 234 // 모바일은 별도 처리
  const itemGap = isMobile ? 0 : 23

  const renderLawyerCard = (lawyer: Lawyer) => {
    return isMobile ? (
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
  }

  if (!allLawyers || allLawyers.length === 0) {
    return null
  }

  return (
    <section className={styles['container']}>
      <LawyerAdvertisementListHeader
        onNext={slideIndex < maxSlideIndex || hasNextPage ? handleClickNext : undefined}
        onPrev={slideIndex > 0 || canGoPrev ? handleClickPrev : undefined}
        onToggle={handleTogglePlay}
        isPlaying={isPlaying}
        refetch={refetch}
      />

      <div className={styles['slider-wrapper']}>
        <div
          className={styles['slider-track']}
          style={{
            transform: `translate3d(-${slideIndex * (itemWidth + itemGap)}px, 0, 0)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {allLawyers.map(lawyer => (
            <div key={lawyer.lawyerId} className={styles['lawyer-item']}>
              {renderLawyerCard(lawyer)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LawyerAdvertisementList
