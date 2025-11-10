import { forwardRef, useEffect, useState } from 'react'
import LegalCurationServiceDesktop from './LegalCurationServiceDesktop'
import LegalCurationServiceMobile from './LegalCurationServiceMobile'

const LegalCurationService = forwardRef<HTMLDivElement>((_props, ref) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile ? <LegalCurationServiceMobile ref={ref} /> : <LegalCurationServiceDesktop ref={ref} />
})

LegalCurationService.displayName = 'LegalCurationService'

export default LegalCurationService
