import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './coreValues.module.scss'

const values = [
  {
    en: 'Reliable',
    ko: '의존하다',
  },
  {
    en: 'Connection',
    ko: '연결하다',
  },
  {
    en: 'Curation',
    ko: '선별하다',
  },
]

const CoreValues = () => {
  const isMobile = useMediaQuery(`(max-width: 56.25rem)`)
  return (
    <section className={styles['core-values']}>
      <div className={styles['core-values-container']}>
        <header className={styles['core-values-header']}>
          <h2 className={styles['core-values-header-title']}>Core Values</h2>

          {!isMobile ? (
            <p className={styles['core-values-header-description']}>
              수만, 수십만에 이르는 법률 블로그, 법률 유튜브 영상에서 법률문제를 겪고 있는
              <br />
              사람들에게 도움이 될 수 있는 올바른 정보만을 선별하여 연결해 드립니다.
            </p>
          ) : (
            <p className={styles['core-values-header-description']}>
              수만, 수십만에 이르는 법률 블로그, <br />
              법률 유튜브 영상에서 법률문제를 겪고 있는 <br />
              사람들에게 도움이 될 수 있는 올바른 정보만을 <br />
              선별하여 연결해 드립니다.
            </p>
          )}
        </header>

        <figure className={styles['core-values-image']}>
          {values.map(value => (
            <div key={value.en} className={styles['core-values-item']}>
              <h3>{value.en}</h3>
              <p>{value.ko}</p>
            </div>
          ))}
        </figure>
      </div>
    </section>
  )
}

export default CoreValues
