import LegalItemWidget from '@/components/legalItemWidget/LegalItemWidget'
import LegalSearchList from '@/container/legalDictionary/LegalSearchList'
import RecentSearches from '@/container/legalDictionary/RecentSearches'

import styles from './dictionary-main.module.scss'

const DictionaryMain = () => {
  return (
    <section className={styles['body-container']}>
      <RecentSearches searchHistory={SearchHistory} />
      <div className={styles['contents-container']}>
        <div className='contents-section'>
          <LegalSearchList legalList={legalList} />
        </div>
        <div className='aside' style={{ width: 250, flexShrink: 0 }}>
          <LegalItemWidget title='많이 찾는 용어' />
          <LegalItemWidget title='최근 등록된 용어' />
        </div>
      </div>
    </section>
  )
}

export default DictionaryMain

const SearchHistory = [
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
  '업무방해죄 [業務妨害罪]',
]

const legalList = [
  {
    id: 1,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 2,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 3,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 4,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 5,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 6,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 7,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 8,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    id: 9,
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
]
