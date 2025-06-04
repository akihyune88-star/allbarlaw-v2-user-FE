import styles from './category-loading.module.scss'

const CategoryLoading = () => {
  return (
    <div className={styles['loading-container']}>
      {/* 첫 번째 카테고리 */}
      <div className={styles['skeleton-category']}>
        <div className={styles['skeleton-main']}></div>
        <div className={styles['skeleton-subs']}>
          <div className={styles['skeleton-sub']}></div>
          <div className={styles['skeleton-sub']}></div>
        </div>
      </div>

      {/* 두 번째 카테고리 */}
      <div className={styles['skeleton-category']}>
        <div className={styles['skeleton-main']}></div>
        <div className={styles['skeleton-subs']}>
          <div className={styles['skeleton-sub']}></div>
          <div className={styles['skeleton-sub']}></div>
          <div className={styles['skeleton-sub']}></div>
        </div>
      </div>

      {/* 세 번째 카테고리 */}
      <div className={styles['skeleton-category']}>
        <div className={styles['skeleton-main']}></div>
      </div>
    </div>
  )
}

export default CategoryLoading
