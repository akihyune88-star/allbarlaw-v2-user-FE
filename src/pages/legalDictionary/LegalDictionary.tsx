import LegalDictionaryHeader from '@/container/legalDictionary/LegalDictionaryHeader'
import styles from './legal-dictionary.module.scss'

const LegalDictionary = () => {
  return (
    <main className={`sub-main-container ${styles.container}`}>
      <LegalDictionaryHeader />
      <section className={styles['body-container']}>
        <div className={styles['recent-search']}>
          <div>최근 검색용어</div>
          {/* 디바이더 */}
          <div />
          <div></div>
        </div>
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div className='contents-section'>1</div>
          <div className='aside'>2</div>
        </div>
      </section>
    </main>
  )
}

export default LegalDictionary
