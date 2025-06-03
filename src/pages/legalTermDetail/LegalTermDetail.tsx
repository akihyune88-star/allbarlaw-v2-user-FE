import { useLocation } from 'react-router-dom'
import LegalItemWidget from '@/components/legalItemWidget/LegalItemWidget'
import styles from './legal-term-detail.module.scss'
import LegalTermDefinition from '@/container/legalTermDetail/LegalTermDefinition'

const LegalTermDetail = () => {
  const { state } = useLocation()
  console.log(state.id)
  return (
    <main className={`sub-main-container ${styles.container}`}>
      <div className='contents-section'>
        <LegalTermDefinition />
      </div>
      <div className='aside' style={{ width: 250, flexShrink: 0 }}>
        <LegalItemWidget title='많이 찾는 용어' />
        <LegalItemWidget title='최근 등록된 용어' />
      </div>
    </main>
  )
}

export default LegalTermDetail
