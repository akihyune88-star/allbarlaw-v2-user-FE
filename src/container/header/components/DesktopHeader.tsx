import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '@/container/header/header.module.scss'
import SvgIcon from '../../../components/SvgIcon'
import InputBox from '../../../components/inputBox/InputBox'
import { ROUTER } from '@/routes/routerConstant'
import HeaderNavigation from './HeaderNavigation'

const DesktopHeader = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      setTimeout(() => {
        setSearchValue('')
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

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
              onKeyDown={handleKeyDown}
              icon={<SvgIcon name='search' style={{ marginRight: 13 }} onClick={handleSearch} />}
            />
          </div>
        </div>
        <HeaderNavigation />
      </div>
    </header>
  )
}

export default DesktopHeader
