import { legalCurationService } from '@/assets/imgs'
import styles from './legalCurationService.module.scss'
import { forwardRef, useEffect, useRef, useState } from 'react'

const LegalCurationService = forwardRef<HTMLDivElement>((_props, ref) => {
  const [expanded, setExpanded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (!isVisible) return

      // 아래로 스크롤 (펼치기)
      if (e.deltaY > 0 && !expanded) {
        e.preventDefault()
        setExpanded(true)
      }
      // 위로 스크롤 (접기)
      else if (e.deltaY < 0 && expanded) {
        e.preventDefault()
        setExpanded(false)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [expanded])

  return (
    <section
      className={styles['legal-curation-service']}
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
      <div className={styles['legal-curation-service-image-wrapper']} data-expanded={expanded}>
        <img
          src={legalCurationService}
          alt='legal-curation-service'
          className={styles['legal-curation-service-image']}
        />
      </div>
    </section>
  )
})

LegalCurationService.displayName = 'LegalCurationService'

export default LegalCurationService
