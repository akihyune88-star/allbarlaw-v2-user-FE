import { useNavigate } from 'react-router-dom'
import styles from './legal-search-list.module.scss'

interface LegalSearchListProps {
  legalList: {
    id: number
    korean: string
    english: string
    hanja: string
  }[]
}
const LegalSearchList = ({ legalList }: LegalSearchListProps) => {
  const navigate = useNavigate()
  const handleClick = (id: number) => {
    navigate(`/legal-dictionary/${id}`, {
      state: {
        id,
      },
    })
  }
  return (
    <div className={styles.container}>
      {legalList.map(item => (
        <div className={styles['legal-item']} onClick={() => handleClick(item.id)}>
          <span className={styles['legal-item-korean']}>{item.korean}</span>
          <span className={styles['legal-item-other-lang']}>
            [{item.hanja} /{item.english}]
          </span>
        </div>
      ))}
    </div>
  )
}

export default LegalSearchList
