import styles from '@/container/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { MENU_LIST } from '@/constants/topMenu'
import { useNavigate } from 'react-router-dom'

const HeaderNavigation = () => {
  const navigation = useNavigate()

  return (
    <div className={styles['navigation-container']}>
      <div className={styles['category']}>
        <SvgIcon name='menu' />
        <span>카테고리</span>
      </div>
      <div className={styles['header-menu-list']}>
        {MENU_LIST.map(item => (
          <button key={item.name} className={styles['menu-item']} onClick={() => navigation(item.path)}>
            {item.name === '바로톡' && (
              <div className={styles['speech-bubble']}>
                <span>변호사랑 바로상담하기</span>
              </div>
            )}
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default HeaderNavigation
