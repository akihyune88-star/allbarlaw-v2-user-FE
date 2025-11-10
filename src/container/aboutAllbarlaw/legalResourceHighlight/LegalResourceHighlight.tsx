import styles from './legalResourceHighlight.module.scss'
import { video, lawyer, post, knowledge } from '@/assets/imgs'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useEffect, useRef, useState } from 'react'

const LegalResourceHighlight = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
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

  const animationItem = [
    {
      itemName: '법률 영상',
      imgPath: video,
      position: { top: '25%', left: '30%' },
      mobilePosition: { top: '5%', left: '2%' },
      slideFrom: 'left',
      scale: 1, // 데스크톱 크기
      mobileScale: 0.8, // 모바일에서 80% 크기
    },
    {
      itemName: '지식인',
      imgPath: knowledge,
      position: { top: '30%', right: '15%' },
      mobilePosition: { top: '15%', right: '-5%' },
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
      position: { bottom: '15%', right: '28%' },
      mobilePosition: { bottom: '-10%', right: '3%' },
      slideFrom: 'right',
      scale: 1,
      mobileScale: 0.5, // 모바일에서 70% 크기
    },
  ]

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
    <div className={styles['legal-resource-highlight-wrapper']}>
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
                style={{ ...currentPosition, transform: `scale(${currentScale})` }}
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
              <strong>5,900+</strong>건
            </p>
            <p>수많은 법률 정보</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LegalResourceHighlight
