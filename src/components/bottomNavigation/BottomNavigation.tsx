import { mobileBottomTapList } from '@/constants/mobileBottomTap'
import styles from './bottom-navigation.module.scss'
import SvgIcon from '../SvgIcon'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const BottomNavigation = () => {
  const navigate = useNavigate()
  const [activeMenuPath, setActiveMenuPath] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<number | null>(null)

  const handleItemClick = (path: string) => {
    setActiveMenuPath(path)
    navigate(path)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // 아래로 스크롤 중이고 50px 이상 스크롤된 경우 숨김
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        // 위로 스크롤 중일 때 표시
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY

      // 스크롤 정지 감지 (300ms 후 다시 표시)
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current)
      }

      scrollTimeout.current = window.setTimeout(() => {
        setIsVisible(true)
      }, 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : styles.hidden}`}>
      {mobileBottomTapList.map(item => {
        const isActive = activeMenuPath === item.path

        return (
          <div
            key={item.path}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => handleItemClick(item.path)}
          >
            <SvgIcon name={isActive ? item.activeIcon : item.icon} size={24} />
            <span className={styles['menu-name']}>{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default BottomNavigation
