import LegalDictionaryHeader from '@/container/legalDictionary/LegalDictionaryHeader'
import styles from './legal-dictionary.module.scss'
import RecentSearches from '@/container/legalDictionary/RecentSearches'
import LegalSearchList from '@/container/legalDictionary/LegalSearchList'

const LegalDictionary = () => {
  return (
    <main className={`sub-main-container ${styles.container}`}>
      <LegalDictionaryHeader />
      <section className={styles['body-container']}>
        <RecentSearches searchHistory={SearchHistory} />
        <div className={styles['contents-container']}>
          <div className='contents-section'>
            <LegalSearchList legalList={legalList} />
          </div>
          <div className='aside' style={{ width: 250 }}>
            2
          </div>
        </div>
      </section>
    </main>
  )
}

export default LegalDictionary

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
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
  {
    korean: '업무방해죄',
    english: 'Obstruction of business',
    hanja: '業務妨害罪',
  },
]
