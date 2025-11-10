import { legalCurationService } from '@/assets/imgs'
import styles from './legalCurationService.module.scss'
import { forwardRef, useEffect, useRef, useState } from 'react'

const LegalCurationService = forwardRef<HTMLDivElement>((_props, ref) => {
  const [expandStep, setExpandStep] = useState(0) // 0: 124px, 1: 100vw, 2: 677px
  const sectionRef = useRef<HTMLDivElement>(null)
  const lastScrollTime = useRef(0)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (!isVisible) return

      // 500ms 디바운스
      const now = Date.now()
      if (now - lastScrollTime.current < 500) {
        e.preventDefault()
        return
      }

      // 아래로 스크롤
      if (e.deltaY > 0) {
        if (expandStep === 0) {
          // 124px → 100vw
          e.preventDefault()
          lastScrollTime.current = now
          setExpandStep(1)
        } else if (expandStep === 1) {
          // 100vw → 677px
          e.preventDefault()
          lastScrollTime.current = now
          setExpandStep(2)
        } else if (expandStep === 2) {
          // Step 2에서는 섹션이 화면 최상단에 있을 때만 다음으로 이동
          if (rect.top >= 0) {
            // 아직 최상단에 있으면 스크롤 차단하지 않음 (자연스럽게 다음 섹션으로)
          }
        }
      }
      // 위로 스크롤 (리버스)
      else if (e.deltaY < 0 && expandStep > 0) {
        e.preventDefault()
        lastScrollTime.current = now
        if (expandStep === 2) {
          // 677px → 100vw
          setExpandStep(1)
        } else if (expandStep === 1) {
          // 100vw → 124px
          setExpandStep(0)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [expandStep])

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
      <div className={styles['legal-curation-service-content']} data-expand-step={String(expandStep)}>
        {expandStep >= 1 && (
          <div className={styles['legal-curation-service-title']}>
            의뢰인과 변호사와의 연결고리
          </div>
        )}
        <div className={styles['legal-curation-service-image-wrapper']} data-expand-step={String(expandStep)}>
          <img
            src={legalCurationService}
            alt='legal-curation-service'
            className={styles['legal-curation-service-image']}
          />
        </div>
        {expandStep === 2 && (
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

LegalCurationService.displayName = 'LegalCurationService'

export default LegalCurationService
