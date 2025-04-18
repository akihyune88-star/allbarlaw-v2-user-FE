import styles from '@/components/aiLoading/ai-loading.module.scss'

const AILoading = () => {
  return (
    <div className={styles['skeleton-container']}>
      <div className={styles['skeleton-header']}>
        <span>AI가 해당 블로그의 포스팅글을 분석중입니다.</span>
      </div>
      <div className={styles['skeleton-content']}>
        <div className={styles['skeleton-paragraph']} style={{ width: 149 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 269 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 169 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 238 }} />
        <div className={styles['skeleton-paragraph']} style={{ width: 149 }} />
      </div>
    </div>
  )
}

export default AILoading
