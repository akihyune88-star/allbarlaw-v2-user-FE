import InputBox from '@/components/inputBox/InputBox'
import styles from './legal-dictionary-header.module.scss'
import React, { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'
import LegalTermReportModal from './LegalTermReportModal'

const SearchInputBox = ({ modalOpen }: { modalOpen: () => void }) => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {}
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }
  return (
    <div className={styles['search-box-wrapper']}>
      <InputBox
        placeholder='검색은 여기에 해주세요'
        value={searchValue}
        className={styles['search-box']}
        onChange={e => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        icon={<SvgIcon name='search' style={{ marginRight: 13 }} onClick={handleSearch} />}
      />

      <button className={styles.button} style={{ alignItems: 'flex-end' }} onClick={modalOpen}>
        <SvgIcon name='error' />
        오류 신고
      </button>
    </div>
  )
}

const ConsonantFilter = () => {
  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(null)

  const handleConsonantClick = (consonant: string) => {
    console.log('선택된 자음:', consonant)
    setSelectedConsonant(consonant)
    // 필터 로직 추가
  }

  return (
    <div className={styles['consonant-filter']}>
      {consonants.map(consonant => (
        <button
          key={consonant}
          className={`${styles['consonant-button']} ${selectedConsonant === consonant ? styles['active'] : ''}`}
          onClick={() => handleConsonantClick(consonant)}
        >
          {consonant}
        </button>
      ))}
    </div>
  )
}

const LegalDictionaryHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  console.log('isModalOpen', isModalOpen)

  const handleModalOpen = () => {
    console.log('handleModalOpen')
    setIsModalOpen(true)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles['title-wrapper']}>
          <h1 className={styles.title}>법률 용어 백사전</h1>
          <div className={styles['button-wrapper']}>
            <button className={styles.button}>히스토리</button>
            <button className={styles.button} onClick={handleModalOpen}>
              <SvgIcon name='error' />
              오류 신고
            </button>
          </div>
        </div>
        <SearchInputBox modalOpen={handleModalOpen} />
        <ConsonantFilter />
      </div>
      <LegalTermReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default LegalDictionaryHeader
