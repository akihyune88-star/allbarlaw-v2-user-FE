import styles from './myLawyer.module.scss'

const MyLawyer = () => {
  const lawyerList = []

  return (
    <div className={styles.myLawyer}>
      {lawyerList.length === 0 ? (
        <div className={styles.emptyMessage}>등록된 Keep이 없습니다.</div>
      ) : (
        // 변호사 목록 렌더링
        <div>변호사 목록</div>
      )}
    </div>
  )
}

export default MyLawyer
