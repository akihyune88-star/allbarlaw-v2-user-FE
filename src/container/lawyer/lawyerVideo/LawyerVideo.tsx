import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerVideo.module.scss'

const LawyerVideo = () => {
  return (
    <section className={styles['lawyer-video']} aria-label='변호사의 영상'>
      <header className={styles['lawyer-video__header']}>
        <h3 className={styles['lawyer-video__title']}>변호사의 영상</h3>
        <button type='button' className={styles['lawyer-video__button']} aria-label='변호사의 영상 더보기'>
          더보기
          <SvgIcon name='arrowSmall' className={styles['lawyer-video__button-icon']} size={14} />
        </button>
      </header>
      <Divider padding={14} />
    </section>
  )
}

export default LawyerVideo
