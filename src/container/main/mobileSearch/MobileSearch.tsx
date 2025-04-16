import InputBox from '@/components/inputBox/InputBox'
import styles from './mobile-search.module.scss'
import { ChangeEvent, useState } from 'react'
import SvgIcon from '@/components/SvgIcon'

const MobileSearch = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)

  return (
    <div className={styles['container']}>
      <h3>{`당신의 법률 문제를 \n도와드립니다.`}</h3>
      <InputBox
        className={styles['round-box']}
        value={searchValue}
        onChange={handleSearchValueChange}
        icon={<SvgIcon name='search' style={{ marginRight: 21 }} strokeWidth={2} />}
      />
      <p>{`분류를 먼저 선택하고\n원하는 모든 법률정보를 쉽게 찾아보세요.`}</p>
    </div>
  )
}

export default MobileSearch
