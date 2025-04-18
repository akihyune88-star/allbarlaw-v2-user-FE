import styles from './lawyer-vertical.module.scss'

type LawyerVerticalProps = {
  id: number
  name: string
  lawfirm: string
  profileImage: string
  type: 1 | 2 | 3
}

const LawyerVertical = ({ id, name, lawfirm, profileImage, type = 3 }: LawyerVerticalProps) => {
  const handleButtonClick = (id: number) => {
    console.log(id)
  }

  return (
    <div className={`${styles['lawyer-vertical']} ${styles[`type-${type}`]}`}>
      <img src={profileImage} alt='변호사 프로필' style={{ borderRadius: 100, objectFit: 'cover' }} />
      <div className={styles['lawyer-info']}>
        <p className={styles.name}>{name} 변호사</p>
        <p className={styles.lawfirm}>{lawfirm}</p>
      </div>
      <div className={styles['lawyer-button-list']}>
        {type === 1 && (
          <>
            <button className={`${styles.button} ${styles['button-line']}`} onClick={() => handleButtonClick(id)}>
              변호사 정보
            </button>
            <button className={`${styles.button} ${styles['button-fill']}`} onClick={() => handleButtonClick(id)}>
              바로톡
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default LawyerVertical
