import LegalItemWidget from '@/components/legalItemWidget/LegalItemWidget'
import LegalSearchList from '@/container/legalDictionary/LegalSearchList'
import RecentSearches from '@/container/legalDictionary/RecentSearches'

import styles from './dictionary-main.module.scss'
import { usePopularLegalTermList, useRecentRegisteredLegalTermList } from '@/hooks/queries/useLegalTerm'

const DictionaryMain = () => {
  const { data: popularLegalTermList } = usePopularLegalTermList()
  const { data: recentRegisteredLegalTermList } = useRecentRegisteredLegalTermList()

  return (
    <section className={styles['body-container']}>
      <RecentSearches />
      <div className={styles['contents-container']}>
        <div className='contents-section'>
          <LegalSearchList />
        </div>
        <div className='aside' style={{ width: 250, flexShrink: 0 }}>
          <LegalItemWidget title='많이 찾는 용어' legalTermList={popularLegalTermList || []} />
          <LegalItemWidget title='최근 등록된 용어' legalTermList={recentRegisteredLegalTermList || []} />
        </div>
      </div>
    </section>
  )
}

export default DictionaryMain

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
