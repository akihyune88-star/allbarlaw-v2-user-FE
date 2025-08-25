import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface HeaderPortalProps {
  children: ReactNode
  portalId?: string
}

const HeaderPortal = ({ children, portalId = 'lawyer-admin-header-portal' }: HeaderPortalProps) => {
  const [mounted, setMounted] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Portal 타겟 찾기
    const findContainer = () => {
      const element = document.getElementById(portalId)
      if (element) {
        setContainer(element)
      }
    }

    // DOM이 준비될 때까지 대기
    findContainer()
    
    // MutationObserver로 동적으로 추가되는 경우 대응
    const observer = new MutationObserver(() => {
      if (!container) {
        findContainer()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      setMounted(false)
    }
  }, [portalId, container])

  if (!mounted || !container) return null

  return createPortal(children, container)
}

export default HeaderPortal