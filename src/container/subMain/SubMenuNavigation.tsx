import React, { useState } from 'react'
import { SUB_MENU_LIST } from '../../constants/submainConstants'
import styles from './sub-menu-navigation.module.scss'

type SubMenuNavigationProps = {
  menuList: (typeof SUB_MENU_LIST)[0][]
  onClick: (menu: (typeof SUB_MENU_LIST)[0]) => void
  initialMenu?: (typeof SUB_MENU_LIST)[0]
}

const SubMenuNavigation = ({ menuList, onClick, initialMenu = SUB_MENU_LIST[0] }: SubMenuNavigationProps) => {
  const [selectedMenu, setSelectedMenu] = useState(initialMenu)

  const handleMenuClick = (menu: (typeof SUB_MENU_LIST)[0]) => {
    setSelectedMenu(menu)
    onClick(menu)
  }

  return (
    <div className={styles['menu-navigation-container']}>
      {menuList.map(menu => (
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
