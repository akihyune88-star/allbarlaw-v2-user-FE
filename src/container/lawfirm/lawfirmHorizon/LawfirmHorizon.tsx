import SvgIcon from '@/components/SvgIcon'
import Tag from '@/components/tag/Tag'
import styles from './lawfirm-horizon.module.scss'
import { usePostTrackView } from '@/hooks/mutatate/usePostTrackView'

interface LawfirmHorizonProps {
  lawfirmId: number
  lawfirmThumbnail: string
  lawfirmName: string
  title: string
  description: string
  address: string | null
  phoneNumber: string | null
  homepageUrl: string | null
  blogUrl: string | null
  linkList?: {
    lawfirmDirectId: number
    lawfirmDirectName: string
    lawfirmDirectLink: string
  }[]
  className?: string
}

const LawfirmHorizon = ({
  lawfirmId,
  lawfirmThumbnail,
  lawfirmName,
  title,
  description,
  address,
  phoneNumber,
  homepageUrl,
  blogUrl,
  linkList,
  className,
}: LawfirmHorizonProps) => {

  const { mutate: trackView } = usePostTrackView()

  const handleContactClick = (url: string) => {
    trackView(lawfirmId)
    window.open(url, '_blank')
  }

  const handleTagClick = (url: string) => {
    trackView(lawfirmId)
    window.open(url, '_blank')
  }

  return (
    <article className={`${styles['lawfirm-horizon']} ${className}`}>
      <figure>
        {lawfirmThumbnail ? (
          <img src={lawfirmThumbnail} alt={lawfirmName} className={styles.thumbnail} />
        ) : (
          <div className={styles.thumbnail} aria-label={`${lawfirmName} 썸네일 없음`} />
        )}
      </figure>
      <div className={styles['lawfirm-info']}>
        <header className={styles['header-wrapper']}>
          <div className={styles['info-header']}>
            <h3 className={styles['lawfirm-name']}>{lawfirmName}</h3>
            <div className={styles['contact-info']}>
              {blogUrl && (
                <button className={styles['contact-info-item']} onClick={() => handleContactClick(blogUrl)}>
                  <SvgIcon name={'blog'} size={24} />
                  <span>블로그</span>
                </button>
              )}
              {homepageUrl && (
                <button className={styles['contact-info-item']} onClick={() => handleContactClick(homepageUrl)}>
                  <SvgIcon name={'homepage'} size={24} />
                  <span>홈페이지</span>
                </button>
              )}
              {address && (
                <button className={styles['contact-info-item']} onClick={() => handleContactClick(address)}>
                  <SvgIcon name={'map'} size={24} />
                  <span>위치</span>
                </button>
              )}
              {phoneNumber && (
                <button className={styles['contact-info-item']} onClick={() => handleContactClick(phoneNumber)}>
                  <SvgIcon name={'call'} size={24} />
                  <span>연락처</span>
                </button>
              )}
            </div>
          </div>
          {lawfirmThumbnail ? (
            <img src={lawfirmThumbnail} alt={lawfirmName} className={styles.thumbnail} />
          ) : (
            <div className={styles.thumbnail} aria-label={`${lawfirmName} 썸네일 없음`} />
          )}
        </header>
        <section className={styles['info-description']}>
          <h3>{title}</h3>
          <p>{description}</p>
        </section>
        <div className={styles['tag-list']}>
          {linkList &&
            linkList.map(link => (
              <Tag
                key={link.lawfirmDirectId}
                tag={link.lawfirmDirectName}
                onClick={() => handleTagClick(link.lawfirmDirectLink)}
              />
            ))}
        </div>
      </div>
    </article>
  )
}
export default LawfirmHorizon
