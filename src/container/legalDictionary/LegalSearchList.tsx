import styles from './legal-search-list.module.scss'

interface LegalSearchListProps {
  legalList: {
    korean: string
    english: string
    hanja: string
  }[]
}
const LegalSearchList = ({ legalList }: LegalSearchListProps) => {
  return (
    <div className={styles.container}>
      {legalList.map(item => (
        <div className={styles['legal-item']}>
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
