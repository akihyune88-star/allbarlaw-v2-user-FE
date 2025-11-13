import usageGuideBanner from '@/assets/imgs/usage-guide-banner.webp'
import styles from './usageBanner.module.scss'

const UsageBannder = () => {
  return (
    <div className={styles['usage-banner']}>
      <figure className={styles['usage-banner-image']}>
        <img src={usageGuideBanner} alt='usage-guide-banner' />
      </figure>
    </div>
  )
}

export default UsageBannder
