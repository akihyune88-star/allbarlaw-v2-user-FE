import React, { useState } from 'react'
import { SUB_MENU_LIST } from './constants'
import styles from './sub-menu-navigation.module.scss'

const SubMenuNavigation = () => {
  const [selectedMenu, setSelectedMenu] = useState(SUB_MENU_LIST[0])

  return (
    <div className={styles['menu-navigation-container']}>
      {SUB_MENU_LIST.map(menu => (
        <div
          className={`${styles['menu-item']} ${selectedMenu.path === menu.path ? styles.selected : ''}`}
          key={menu.path}
          onClick={() => setSelectedMenu(menu)}
          style={{ '--item-width': `${menu.itemWidth}px` } as React.CSSProperties}
        >
          <span>{menu.name}</span>
        </div>
      ))}
    </div>
  )
}

export default SubMenuNavigation
