import { legalCurationService } from '@/assets/imgs'
import styles from './legalCurationServiceDesktop.module.scss'
import { forwardRef, useEffect, useRef, useState } from 'react'

const LegalCurationServiceDesktop = forwardRef<HTMLDivElement>((_props, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0) // 0-1 사이의 값
  const [showTitle, setShowTitle] = useState(false)
  const [showText, setShowText] = useState(false)

  // 스크롤 기반 애니메이션 단계
  const expandToFullWidth = scrollProgress >= 0.2 // 20%에서 전체 너비로 확장
  const shrinkToWindow = scrollProgress >= 0.5 // 50%에서 677px 창문으로 축소

  useEffect(() => {
    const handleScroll = () => {
      const currentElement = sectionRef.current
      if (!currentElement) return

      const rect = currentElement.getBoundingClientRect()
      const sectionHeight = currentElement.offsetHeight
      const viewportHeight = window.innerHeight

      // 섹션 이전일 때 (아직 화면에 들어오지 않음)
      if (rect.top >= viewportHeight) {
        setScrollProgress(0)
        setShowTitle(false)
        setShowText(false)
      }
      // 섹션이 화면에 보이는 경우에만 진행도 계산
      else if (rect.top <= 0 && rect.bottom > viewportHeight) {
        // 스크롤 진행도 계산 (0-1 사이 값)
        const scrolled = Math.abs(rect.top)
        const progress = Math.min(scrolled / (sectionHeight - viewportHeight), 1)
        setScrollProgress(progress)

        // 타이틀 표시 (30% 진행)
        if (progress > 0.3 && !showTitle) {
          setShowTitle(true)
        } else if (progress <= 0.3 && showTitle) {
          setShowTitle(false)
        }

        // 텍스트 표시 (60% 진행)
        if (progress > 0.6 && !showText) {
          setShowText(true)
        } else if (progress <= 0.6 && showText) {
          setShowText(false)
        }
      }
      // 섹션을 지나쳤을 때
      else if (rect.bottom <= 0) {
        setScrollProgress(1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // 초기 로드 시에도 실행
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showTitle, showText])

  // expandStep 계산 (기존 SCSS와 호환)
  const expandStep = shrinkToWindow ? 2 : expandToFullWidth ? 1 : 0

  return (
    <section
      className={styles['legal-curation-service']}
      data-step={expandStep}
      ref={node => {
        sectionRef.current = node as HTMLDivElement
        if (ref) {
          if (typeof ref === 'function') {
            ref(node as HTMLDivElement)
          } else {
            ;(ref as { current: HTMLDivElement | null }).current = node as HTMLDivElement
          }
        }
      }}
    >
      <div
        className={styles['legal-curation-service-content']}
        data-expand-step={String(expandStep)}
        style={{
          opacity: scrollProgress < 1 ? 1 : 0,
          pointerEvents: scrollProgress < 1 ? 'auto' : 'none',
        }}
      >
        {showTitle && <div className={styles['legal-curation-service-title']}>의뢰인과 변호사와의 연결고리</div>}
        <div className={styles['legal-curation-service-image-wrapper']} data-expand-step={String(expandStep)}>
          <img
            src={legalCurationService}
            alt='legal-curation-service'
            className={styles['legal-curation-service-image']}
          />
        </div>
        {showText && (
          <div className={styles['legal-curation-service-text']}>
            <h2>
              나에게 꼭 필요한
              <br />
              법률정보만 골라볼 순 없을까?
            </h2>
            <p>
              세상에 똑같은 고민은 없기에
              <br />
              오직 나만을 위한 해결책이 필요합니다 <br />
              수많은 올바로의 법률정보 속에서
              <br />내 문제의 해결책을 찾아보시기 바랍니다.
            </p>
          </div>
        )}
      </div>
    </section>
  )
})

LegalCurationServiceDesktop.displayName = 'LegalCurationServiceDesktop'

export default LegalCurationServiceDesktop
