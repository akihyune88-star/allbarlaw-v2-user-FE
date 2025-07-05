import { useParams } from 'react-router-dom'
import styles from './social-check.module.scss'
import { useSocialAuth, isValidProvider } from '@/hooks/useSocialAuth'

const SocialCheck = () => {
  const { provider } = useParams()
  const { isValidProvider: isValid } = useSocialAuth(provider)

  if (!isValid) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <p className={styles.text}>로그인 처리 중...</p>
    </div>
  )
}

export default SocialCheck
