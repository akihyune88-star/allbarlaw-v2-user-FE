import InputBox from '@/components/inputBox/InputBox'
import styles from './legal-dictionary-header.module.scss'
import React, { useState, useRef, useEffect } from 'react'
import SvgIcon from '@/components/SvgIcon'
import LegalTermReportModal from './LegalTermReportModal'
import { useLegalDictionaryStore } from '@/stores/useLegalDictionaryStore'
import { useDeleteRecentSearch, useRecentSearches } from '@/hooks/queries/useLegalTerm'
import { LegalTermItem } from '@/types/legalTermTypes'

const SearchInputBox = ({ modalOpen }: { modalOpen: () => void }) => {
  const { setSearchValue, setSelectedConsonant } = useLegalDictionaryStore()
  const { data: recentSearches } = useRecentSearches()
  const [localSearchValue, setLocalSearchValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { mutate: deleteRecentSearch } = useDeleteRecentSearch({
    onSuccess: () => {},
    onError: () => {
      console.log('error')
    },
  })

  const handleSearch = () => {
    setSearchValue(localSearchValue)
    setSelectedConsonant(null)
    setIsDropdownOpen(false)
  }

  const handleSelectItem = (term: string) => {
    setLocalSearchValue(term)
    setSearchValue(term)
    setIsDropdownOpen(false)
  }

  const handleDeleteRecentSearch = (e: React.MouseEvent, term: LegalTermItem) => {
    e.stopPropagation()
    deleteRecentSearch(term.koreanName)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!recentSearches || recentSearches.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < recentSearches.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < recentSearches.length) {
          handleSelectItem(recentSearches[selectedIndex].koreanName)
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setIsDropdownOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles['search-box-wrapper']} ref={dropdownRef}>
      <div className={styles['input-container']}>
        <InputBox
          placeholder='검색은 여기에 해주세요'
          value={localSearchValue}
          className={styles['search-box']}
          onChange={e => setLocalSearchValue(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          icon={<SvgIcon name='search' style={{ marginRight: 13 }} onClick={handleSearch} />}
        />

        {isDropdownOpen && recentSearches && recentSearches.length > 0 && (
          <div className={styles['dropdown']}>
            {recentSearches.map((item, index) => (
              <div
                key={item.legalTermId}
                className={`${styles['dropdown-item']} ${index === selectedIndex ? styles['selected'] : ''}`}
                onClick={() => handleSelectItem(item.koreanName)}
              >
                <span className={styles['term-text']}>{item.koreanName}</span>
                <button className={styles['delete-btn']} onClick={e => handleDeleteRecentSearch(e, item)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className={styles.button} style={{ alignItems: 'flex-end' }} onClick={modalOpen}>
        <SvgIcon name='error' />
        오류 신고
      </button>
    </div>
  )
}

const ConsonantFilter = () => {
  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
  const { selectedConsonant, setSelectedConsonant } = useLegalDictionaryStore()

  const handleConsonantClick = (consonant: string) => {
    setSelectedConsonant(consonant === selectedConsonant ? null : consonant)
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

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles['title-wrapper']}>
          <h1 className={styles.title}>법률 용어 백과사전</h1>
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
