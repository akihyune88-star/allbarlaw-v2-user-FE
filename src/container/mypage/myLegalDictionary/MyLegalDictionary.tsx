import styles from './myLegalDictionary.module.scss'

const MyLegalDictionary = () => {
  const legalDictionaryList = []

  return (
    <div className={styles.myLegalDictionary}>
      {legalDictionaryList.length === 0 ? (
        <div className={styles.emptyMessage}>등록된 Keep이 없습니다.</div>
      ) : (
        // 법률 사전 목록 렌더링
        <div>법률 사전 목록</div>
      )}
    </div>
  )
}

export default MyLegalDictionary
