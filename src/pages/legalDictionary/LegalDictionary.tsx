import LegalDictionaryHeader from '@/container/legalDictionary/LegalDictionaryHeader'
import styles from './legal-dictionary.module.scss'
import RecentSearches from '@/container/legalDictionary/RecentSearches'

const LegalDictionary = () => {
  return (
    <main className={`sub-main-container ${styles.container}`}>
      <LegalDictionaryHeader />
      <section className={styles['body-container']}>
        <RecentSearches />
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div className='contents-section'>1</div>
          <div className='aside'>2</div>
        </div>
      </section>
    </main>
  )
}

export default LegalDictionary
