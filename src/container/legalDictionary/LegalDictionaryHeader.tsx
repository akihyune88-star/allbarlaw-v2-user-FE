import InputBox from '@/components/inputBox/InputBox'
import styles from './legal-dictionary-header.module.scss'
import React, { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'

const LegalDictionaryHeader = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {}
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>법률 용어 백과사전</h1>
      <InputBox
        placeholder='검색은 여기에 해주세요'
        value={searchValue}
        className={styles['search-box']}
        onChange={e => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        icon={<SvgIcon name='search' style={{ marginRight: 13 }} onClick={handleSearch} />}
      />
    </div>
  )
}

export default LegalDictionaryHeader
