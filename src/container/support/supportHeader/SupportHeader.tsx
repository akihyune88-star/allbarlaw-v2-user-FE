import styles from './support-header.module.scss'

const SupportHeaderTitle = ({ title }: { title: string }) => {
  return (
    <div className={styles['support-header-title']}>
      {/* Desktop View */}
      <h1 className={styles['desktop-title']}>{title}</h1>

      {/* Mobile View */}
      <h2 className={styles['mobile-title']}>{title}</h2>
    </div>
  )
}

export default SupportHeaderTitle
