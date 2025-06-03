import LegalDictionaryHeader from '@/container/legalDictionary/LegalDictionaryHeader'
import styles from './legal-dictionary.module.scss'
import { Outlet } from 'react-router-dom'

const LegalDictionary = () => {
  return (
    <main className={`sub-main-container ${styles.container}`}>
      <LegalDictionaryHeader />
      <Outlet />
    </main>
  )
}

export default LegalDictionary
