import { useState, useRef, useEffect } from 'react'
import { SUB_MENU_LIST } from './constants'
import styles from './sub-menu-navigation.module.scss'

const SubMenuNavigation = () => {
  const [selectedMenu, setSelectedMenu] = useState(SUB_MENU_LIST[0])
  const [borderStyle, setBorderStyle] = useState({ width: 0, left: 0 })
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const selectedElement = menuRefs.current[selectedMenu.path]
    const container = containerRef.current
    if (selectedElement && container) {
      const containerRect = container.getBoundingClientRect()
      const elementRect = selectedElement.getBoundingClientRect()

      setBorderStyle({
        width: elementRect.width,
        left: elementRect.left - containerRect.left,
      })
    }
  }, [selectedMenu])

  return (
    <div ref={containerRef} className={styles['menu-navigation-container']}>
      {SUB_MENU_LIST.map(menu => (
        <div
          ref={el => {
            menuRefs.current[menu.path] = el
          }}
          className={`${styles['menu-item']} ${selectedMenu.path === menu.path ? styles.selected : ''}`}
          style={{ width: menu.itemWidth }}
          key={menu.path}
          onClick={() => setSelectedMenu(menu)}
        >
          <span>{menu.name}</span>
        </div>
      ))}
      <div
        className={styles['border-bar']}
        style={{
          width: `${borderStyle.width}px`,
          left: `${borderStyle.left}px`,
        }}
      />
    </div>
  )
}

export default SubMenuNavigation
