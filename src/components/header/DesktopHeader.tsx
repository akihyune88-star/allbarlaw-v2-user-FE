import styles from '@/components/header/header.module.scss'
import SvgIcon from '../SvgIcon'
import InputBox from '../inputBox/InputBox'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const DesktopHeader = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  return (
    <header className={styles['desktop-container']}>
      <div className={styles['inner-container']}>
        <div className={styles['header-top']}>
          <SvgIcon name='pcLogoHorizon' className={styles['header-logo']} onClick={() => navigate(ROUTER.MAIN)} />
          <div className={styles['search-form']}>
            <InputBox
              placeholder='검색은 여기에 해주세요'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              iconType='search'
            />
          </div>
          <nav className={styles['user-navigation']}>
            <SvgIcon name='login' onClick={() => navigate(ROUTER.LOGIN)} />
            <SvgIcon name='mypage' onClick={() => navigate(ROUTER.MYPAGE)} />
          </nav>
        </div>
        <nav className={styles['main-navigation']}>1111</nav>
      </div>
    </header>
  )
}

export default DesktopHeader
