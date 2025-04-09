import styles from '@/components/header/header.module.scss'
import SvgIcon from '../SvgIcon'
import InputBox from '../inputBox/InputBox'
import { useState } from 'react'

const PcHeader = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <header className={styles['header-desktop']}>
      <div className={styles['header-wrapper']}>
        <div className={styles['header-top']}>
          <SvgIcon name='pcLogoHorizon' className={styles['header-logo']} />
          <div className={styles['search-form']}>
            <InputBox
              placeholder='검색은 여기에 해주세요'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              iconType='search'
            />
          </div>
          <nav className={styles['user-navigation']}>
            <SvgIcon name='login' />
            <SvgIcon name='mypage' />
          </nav>
        </div>
        <nav className={styles['main-navigation']}></nav>
      </div>
    </header>
  )
}

export default PcHeader
