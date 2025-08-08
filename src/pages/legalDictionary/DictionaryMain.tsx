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
