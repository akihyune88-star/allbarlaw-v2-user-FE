import { useState, useEffect, useRef } from 'react'
import styles from './lawyer-video-spotlight.module.scss'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PlayButton from '@/components/playButton/PlayButton'
import { COLOR } from '@/styles/color'
import { useNavigationHistory } from '@/hooks'
import { useGetVideoCount } from '@/hooks/queries/useVideo'
import DesktopVidoeSpotlight from './DesktopVidoeSpotlight'
import MobileVidoeSpotlight from './MobileVidoeSpotlight'
import Divider from '@/components/divider/Divider'

const LawyerVideoSpotlightHeader = ({
  onNext,
  onPrev,
  onToggle,
  isPlaying,
}: {
  onNext?: () => void
  onPrev?: () => void
  onToggle?: () => void
  isPlaying?: boolean
  refetch?: () => void
}) => {
  const { data: totalVideoCount } = useGetVideoCount({
    subcategoryId: 'all',
    recentDays: 'all',
  })

  const { data: recentMonthVideoCount } = useGetVideoCount({
    subcategoryId: 'all',
    recentDays: 30,
  })

  return (
    <header className={styles['header-container']}>
      <div className={styles['text-wrapper']}>
        <h2 className={styles.title}>변호사의 영상</h2>
        <div className={styles.count}>
          <span className={styles['count-number']}>전체 {totalVideoCount?.toLocaleString()}개 / </span>
          <span className={styles['count-number']}>최근 한달 {recentMonthVideoCount?.toLocaleString()}개</span>
        </div>
      </div>
      {/* {!isMobile ? ( */}
      <PlayButton
        iconColor={COLOR.text_black}
        onNext={onNext}
        onPrev={onPrev}
        onToggle={onToggle}
        isPlaying={isPlaying}
      />
      {/* ) : (
        <SvgIcon name='refresh' size={16} onClick={refetch} style={{ cursor: 'pointer' }} />
      )} */}
    </header>
  )
}

const LawyerVideoSpotlight = () => {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const [slideIndex, setSlideIndex] = useState(0) // 현재 슬라이드 인덱스
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev, reset } = useNavigationHistory()

  const itemsPerView = isMobile ? 2 : 3 // 모바일 2개, PC 3개
  const totalFetchCount = isMobile ? 10 : 9 // 모바일 10개, PC 9개

  // 현재 데이터 (더 많이 받기)
  const {
    videoList: currentVideos,
    hasNextPage,
    refetch,
  } = useRandomVideoList({
    subcategoryId: 'all',
    take: totalFetchCount,
    excludeIds: currentExcludeIds,
  })

  // 다음 데이터 미리 fetching (PC만)
  const nextExcludeIds = [...currentExcludeIds, ...currentVideos.map(video => video.videoCaseId)]
  const { videoList: nextVideos } = useRandomVideoList({
    subcategoryId: 'all',
    take: totalFetchCount,
    excludeIds: nextExcludeIds,
    enabled: !isMobile && hasNextPage && currentVideos.length > 0, // PC만 다음 데이터 로드
  })

  // 전체 슬라이드 데이터 (현재 + 다음) - 중복 제거
  const allVideos = isMobile
    ? currentVideos.slice(0, 10) // 모바일: 10개로 제한
    : [...currentVideos, ...nextVideos].filter(
        (video, index, self) => self.findIndex(v => v.videoCaseId === video.videoCaseId) === index
      )
  const maxSlideIndex = Math.max(0, allVideos.length - itemsPerView)

  const handleNextClick = () => {
    if (isTransitioning) return

    if (slideIndex >= maxSlideIndex) {
      if (isMobile) {
        // 모바일: 10개 제한, 처음으로 돌아가기
        setSlideIndex(0)
      } else {
        // PC: 끝에 도달하면 더 많은 데이터 가져오기
        if (hasNextPage) {
          const currentIds = currentVideos.map(video => video.videoCaseId)
          handleNext(currentIds)
          setSlideIndex(0) // 새 데이터로 리셋
        } else {
          // 더 이상 데이터가 없으면 처음부터
          reset()
          setSlideIndex(0)
        }
      }
    } else {
      // 한 칸 이동
      setIsTransitioning(true)
      setSlideIndex(prev => prev + 1)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }

  const handlePrevClick = () => {
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
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        handleNextClick()
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
  }, [isPlaying, slideIndex, allVideos, hasNextPage])

  const handleVideoClick = (subcategoryId: number, videoId: number) => {
    navigate(`/${subcategoryId}/video/${videoId}`)
  }

  if (!allVideos || allVideos.length === 0) {
    return null
  }

  return (
    <section className={styles.container}>
      <LawyerVideoSpotlightHeader
        onNext={slideIndex < maxSlideIndex || hasNextPage ? handleNextClick : undefined}
        onPrev={slideIndex > 0 || canGoPrev ? handlePrevClick : undefined}
        onToggle={handleTogglePlay}
        isPlaying={isPlaying}
        refetch={refetch}
      />
      <DesktopVidoeSpotlight
        allVideos={allVideos}
        slideIndex={slideIndex}
        isTransitioning={isTransitioning}
        isMobile={isMobile}
        handleVideoClick={handleVideoClick}
      />
      {isMobile ? (
        <>
          <Divider padding={0} />
          <MobileVidoeSpotlight excludeIds={currentExcludeIds.slice(0, 10)} handleVideoClick={handleVideoClick} />
        </>
      ) : null}
    </section>
  )
}

export default LawyerVideoSpotlight
