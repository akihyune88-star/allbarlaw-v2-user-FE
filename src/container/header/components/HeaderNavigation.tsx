import styles from '@/container/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { MENU_LIST } from '../constants'

const HeaderNavigation = () => {
  return (
    <div className={styles['navigation-container']}>
      <div className={styles['category']}>
        <SvgIcon name='menu' />
        <span>카테고리</span>
      </div>
      <div className={styles['header-menu-list']}>
        {MENU_LIST.map(item => (
          <button className={styles['menu-item']}>
            <span>{item.name}</span>
          </button>
        ))}
      </div>
      <div className={styles['chat-btn']}>
        <button>바로톡</button>
      </div>
    </div>
  )
}

export default HeaderNavigation
