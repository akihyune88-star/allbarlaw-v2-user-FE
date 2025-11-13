import styles from './legalResourceHighlight.module.scss'
import { video, lawyer, post, baroTalk, knowledge } from '@/assets/imgs'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useEffect, useRef, useState } from 'react'

const animationItem = [
  {
    itemName: '법률 영상',
    imgPath: video,
    position: { top: '20%', left: '25%' },
    mobilePosition: { top: '5%', left: '2%' },
    slideFrom: 'left',
    scale: 1, // 데스크톱 크기
    mobileScale: 0.8, // 모바일에서 80% 크기
  },
  {
    itemName: '지식인',
    imgPath: baroTalk,
    position: { top: '30%', right: '15%' },
    mobilePosition: { top: '15%', right: '-10px' },
    slideFrom: 'right',
    scale: 1,
    mobileScale: 0.8,
  },
  {
    itemName: '변호사',
    imgPath: lawyer,
    position: { bottom: '15%', left: '15%' },
    mobilePosition: { bottom: '3%', left: '2%' },
    slideFrom: 'left',
    scale: 1,
    mobileScale: 1, // 모바일에서도 100% 유지
  },
  {
    itemName: '법률정보 글',
    imgPath: post,
    position: { bottom: '10%', right: '28%' },
    mobilePosition: { bottom: '-15%', right: '3%' },
    slideFrom: 'right',
    scale: 1,
    mobileScale: 0.5, // 모바일에서 70% 크기
  },
]

const sliderItem = [
  {
    itemName: '법률정보 글',
    imgPath: post,
    content: `분야별, 사건별로 정리된 법률 정보글을\n 올바로 AI가 글의 핵심을 요약하여 제공합니다.`,
  },
  {
    itemName: '법률 영상',
    imgPath: video,
    content: `변호사의 노하우가 담긴 양질의 영상을 선별하고 올바로 AI가 영상의 핵심을 요약하여 제공합니다.`,
  },
  {
    itemName: '법률 지식인',
    imgPath: knowledge,
    content: `단 한번의 질문으로 여러 명의 전문변호사에게 내 고민에 대한 답변을 들을 수 있습니다.`,
  },
  {
    itemName: '법률 변호사',
    imgPath: baroTalk,
    content: `비밀이 보장되는 변호사와의 1:1 상담으로\n내 문제의 해결책을 찾을 수 있습니다.`,
  },
]

const LegalResourceHighlight = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
            setCount(0) // 섹션을 벗어나면 카운트 초기화
          }
        })
      },
      { threshold: 0.3 } // 30% 보일 때 트리거
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // 카운팅 애니메이션
  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2초 동안 애니메이션
    const targetCount = 5900
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // easeOutCubic 이징 함수 (부드러운 감속)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeProgress * targetCount)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(targetCount) // 정확히 5900으로 마무리
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible])

  // 중앙 컨텐츠 위치 설정
  const contentPosition = {
    top: '50%',
    left: '50%',
  }
  const mobileContentPosition = {
    top: '50%',
    left: '50%',
  }

  return (
    <>
      <main className={styles['legal-resource-highlight-wrapper']}>
        <div className={styles['legal-resource-highlight']}>
          <h2 className={styles['legal-resource-highlight-title']}>
            올바로에
            <br />다 모아놨습니다.
          </h2>
          <section className={styles['legal-resource-highlight-animation']} ref={sectionRef}>
            {animationItem.map((item, index) => {
              const currentPosition = isMobile ? item.mobilePosition : item.position
              const currentScale = isMobile ? item.mobileScale : item.scale

              return (
                <div
                  key={index}
                  className={`${styles['legal-resource-highlight-animation-item']} ${
                    item.itemName === '글' ? styles['post-item'] : ''
                  } ${isVisible ? styles[`slide-from-${item.slideFrom}`] : ''}`}
                  style={{
                    ...currentPosition,
                    ...(currentScale !== 1 && { transform: `scale(${currentScale})` }),
                  }}
                >
                  <img src={item.imgPath} alt={item.itemName} />
                  <p>{item.itemName}</p>
                </div>
              )
            })}

            <div
              className={styles['legal-resource-highlight-animation-content']}
              style={isMobile ? mobileContentPosition : contentPosition}
            >
              <p>
                <strong>{count.toLocaleString()}+</strong>건
              </p>
              <p>수많은 법률 정보</p>
            </div>
          </section>
        </div>
      </main>
      {/* 슬라이더부분 */}
      <main className={styles['legal-resource-highlight-slider']}>
        <section className={styles['legal-resource-highlight-slider-content']}>
          <h2 className={styles['legal-resource-highlight-slider-content-title']}>서비스 소개</h2>

          <ul className={styles['legal-resource-highlight-slider-content-items']}>
            {sliderItem.map((item, index) => (
              <li key={index} className={styles['legal-resource-highlight-slider-content-item']}>
                <img
                  src={item.imgPath}
                  alt={item.itemName}
                  className={styles['legal-resource-highlight-slider-content-item-img']}
                />
                <div className={styles['legal-resource-highlight-slider-content-item-title-container']}>
                  <h2 className={styles['legal-resource-highlight-slider-content-item-title']}>
                    <strong>0{index + 1}</strong>
                    {item.itemName}
                  </h2>
                  <img
                    src={item.imgPath}
                    alt={item.itemName}
                    className={styles['legal-resource-highlight-slider-content-item-img-mobile']}
                  />
                </div>
                <p className={styles['legal-resource-highlight-slider-content-item-description']}>{item.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}

export default LegalResourceHighlight
