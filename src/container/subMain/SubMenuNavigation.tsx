import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SUB_MENU_LIST } from '../../constants/submainConstants'
import styles from './sub-menu-navigation.module.scss'

const SubMenuNavigation = () => {
  const [selectedMenu, setSelectedMenu] = useState(SUB_MENU_LIST[0])
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

  const handleMenuClick = (menu: (typeof SUB_MENU_LIST)[0]) => {
    setSelectedMenu(menu)
    navigate(`/${subcategoryId}${menu.path}`)
  }

  return (
    <div className={styles['menu-navigation-container']}>
      {SUB_MENU_LIST.map(menu => (
        <div
          className={`${styles['menu-item']} ${selectedMenu.path === menu.path ? styles.selected : ''}`}
          key={menu.path}
          onClick={() => handleMenuClick(menu)}
          style={{ '--item-width': `${menu.itemWidth}px` } as React.CSSProperties}
        >
          <span>{menu.name}</span>
        </div>
      ))}
    </div>
  )
}

export default SubMenuNavigation
