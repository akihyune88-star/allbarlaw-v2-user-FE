import React, { useEffect, useState } from 'react'
import { useGeocoding } from '@/hooks/queries/useGeocoding'
import { GeocodingAddress } from '@/types/geocodingTypes'
import styles from './addressSearchModal.module.scss'

interface AddressData {
  address: string
  zonecode: string
}

interface AddressSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: AddressData) => void
}

const RESULT_THRESHOLD = 20 // 많은 결과의 기준

const AddressSearchModal = ({ isOpen, onClose, onComplete }: AddressSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [addressList, setAddressList] = useState<GeocodingAddress[]>([])
  const [filteredAddressList, setFilteredAddressList] = useState<GeocodingAddress[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  const { mutate: searchAddress, isPending } = useGeocoding({
    onSuccess: data => {
      if (data.addresses && data.addresses.length > 0) {
        setAddressList(data.addresses)
        setFilteredAddressList(data.addresses)
        setFilterQuery('')
        setErrorMessage('')
      } else {
        setAddressList([])
        setFilteredAddressList([])
        setErrorMessage('검색 결과가 없습니다. 다른 검색어를 입력해주세요.')
      }
    },
    onError: () => {
      setAddressList([])
      setFilteredAddressList([])
      setErrorMessage('주소 검색에 실패했습니다. 다시 시도해주세요.')
    },
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setSearchQuery('')
      setAddressList([])
      setFilteredAddressList([])
      setFilterQuery('')
      setErrorMessage('')
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // 필터링 로직
  useEffect(() => {
    if (!filterQuery.trim()) {
      setFilteredAddressList(addressList)
      return
    }

    const filtered = addressList.filter(
      address =>
        address.roadAddress.toLowerCase().includes(filterQuery.toLowerCase()) ||
        address.jibunAddress.toLowerCase().includes(filterQuery.toLowerCase())
    )
    setFilteredAddressList(filtered)
  }, [filterQuery, addressList])

  if (!isOpen) return null

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setErrorMessage('검색어를 입력해주세요.')
      return
    }
    searchAddress(searchQuery.trim())
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterQuery(e.target.value)
  }

  const clearFilter = () => {
    setFilterQuery('')
  }

  const hasManyResults = addressList.length >= RESULT_THRESHOLD
  const displayList = filteredAddressList

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSelectAddress = (address: GeocodingAddress) => {
    onComplete({
      address: address.roadAddress || address.jibunAddress,
      zonecode: '',
    })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>주소를 검색해주세요</h2>
          <button type='button' onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.searchBox}>
          <input
            type='text'
            placeholder='도로명, 지번, 건물명 검색'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
            autoFocus
          />
          <button type='button' onClick={handleSearch} disabled={isPending} className={styles.searchButton}>
            {isPending ? '검색 중...' : '검색'}
          </button>
        </div>

        {addressList.length === 0 && !errorMessage && (
          <div className={styles.guide}>
            <p className={styles.guideTitle}>이렇게 검색해보세요!</p>
            <ul className={styles.guideList}>
              <li>· 도로명 + 건물번호</li>
              <li className={styles.guideExample}>예) 정자일로 95, 불정로 6</li>
              <li>· 동/읍/면 + 번지</li>
              <li className={styles.guideExample}>예) 정자동 178-4, 동탄 만리길 1000</li>
            </ul>
          </div>
        )}

        {addressList.length > 0 && (
          <div className={styles.resultHeader}>
            {hasManyResults && (
              <div className={styles.filterBox}>
                <input
                  type='text'
                  placeholder='수정로'
                  value={filterQuery}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                />
                {filterQuery && (
                  <button type='button' onClick={clearFilter} className={styles.clearButton}>
                    ✕
                  </button>
                )}
              </div>
            )}
            {hasManyResults && (
              <div className={styles.resultCount}>
                <p className={styles.resultNotice}>
                  <span className={styles.noticeIcon}>!</span>
                  <span>검색결과가 많습니다. 정확한 결과를 위해 지역명/도로명/건물명(번지)을 입력해주세요</span>
                </p>
                <p className={styles.countText}>
                  총 <strong>{displayList.length}건</strong> 이상
                </p>
              </div>
            )}
          </div>
        )}

        <div className={styles.content}>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

          {displayList.length > 0 && (
            <div className={styles.resultList}>
              {displayList.map((address, index) => (
                <div key={index} className={styles.resultItem} onClick={() => handleSelectAddress(address)}>
                  <div className={styles.resultMain}>
                    <span className={styles.resultBadge}>도로명</span>
                    {address.roadAddress}
                  </div>
                  {address.jibunAddress && address.jibunAddress !== address.roadAddress && (
                    <div className={styles.resultSub}>
                      <span className={styles.resultBadge}>지번</span>
                      {address.jibunAddress}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {addressList.length > 0 && displayList.length === 0 && (
            <div className={styles.errorMessage}>필터 조건에 맞는 결과가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddressSearchModal
