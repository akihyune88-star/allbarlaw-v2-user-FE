import styles from '@/components/lawfirm/lawfirm-horizon.module.scss'
import Tag from '../tag/Tag'
import { KeyOfIcon } from '@/types/svg'
import SvgIcon from '../SvgIcon'

interface LawfirmHorizonProps {
  lawfirmThumbnail: string
  lawfirmName: string
  title: string
  description: string
  address: string | null
  phoneNumber: string | null
  homepageUrl: string | null
  blogUrl: string | null
  linkList?: { label: string; url: string }[]
  className?: string
}

const LawfirmHorizon = ({
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
  const handleTagClick = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <article className={`${styles['lawfirm-horizon']} ${className}`}>
      <figure>
        <img src={lawfirmThumbnail} alt={lawfirmName} className={styles.thumbnail} />
      </figure>
      <div className={styles['lawfirm-info']}>
        <header className={styles['header-wrapper']}>
          <div className={styles['info-header']}>
            <h3 className={styles['lawfirm-name']}>{lawfirmName}</h3>
            <div className={styles['contact-info']}>
              {blogUrl && (
                <div className={styles['contact-info-item']}>
                  <SvgIcon name={'blog'} size={24} />
                  <span>블로그</span>
                </div>
              )}
              {homepageUrl && (
                <div className={styles['contact-info-item']}>
                  <SvgIcon name={'homepage'} size={24} />
                  <span>홈페이지</span>
                </div>
              )}
              {address && (
                <div className={styles['contact-info-item']}>
                  <SvgIcon name={'map'} size={24} />
                  <span>위치</span>
                </div>
              )}
              {phoneNumber && (
                <div className={styles['contact-info-item']}>
                  <SvgIcon name={'call'} size={24} />
                  <span>연락처</span>
                </div>
              )}
            </div>
          </div>
          <img src={lawfirmThumbnail} alt={lawfirmName} className={styles.thumbnail} />
        </header>
        <section className={styles['info-description']}>
          <h3>{title}</h3>
          <p>{description}</p>
        </section>
        <div className={styles['tag-list']}>
          {linkList &&
            linkList.map(link => <Tag key={link.label} tag={link.label} onClick={() => handleTagClick(link.url)} />)}
        </div>
      </div>
    </article>
  )
}
export default LawfirmHorizon
