import { useParams } from 'react-router-dom'
import styles from './social-check.module.scss'
import { useSocialAuth } from '@/hooks/useSocialAuth'

const SocialCheck = () => {
  const { provider } = useParams()
  console.log('🟢 SocialCheck 컴포넌트 렌더링')
  console.log('- provider from params:', provider)
  
  const { isValidProvider: isValid } = useSocialAuth(provider)
  console.log('- isValid:', isValid)

  if (!isValid) {
    console.log('❌ 유효하지 않은 provider로 null 반환')
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
