import styles from '@/components/aiLoading/ai-loading.module.scss'

type AILoadingProps = {
  title: string
}

const AILoading = ({ title }: AILoadingProps) => {
  return (
    <div className={styles['skeleton-container']}>
      <div className={styles['skeleton-header']}>
        <span>{title}</span>
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
