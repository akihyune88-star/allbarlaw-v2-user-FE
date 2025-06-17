import styles from '@/components/lawfirm/lawfirm-horizon.module.scss'
import Tag from '../tag/Tag'
import { KeyOfIcon } from '@/types/svg'
import SvgIcon from '../SvgIcon'

interface LawfirmHorizonProps {
  lawfirmThumbnail: string
  lawfirmName: string
  title: string
  description: string
  address: string
  phoneNumber: string
  homepageUrl: string
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
  linkList,
  className,
}: LawfirmHorizonProps) => {
  const contactInfo: { label: string; icon: KeyOfIcon; value: string }[] = [
    {
      label: '위치',
      icon: 'map',
      value: address,
    },
    {
      label: '전화번호',
      icon: 'call',
      value: phoneNumber,
    },
    {
      label: '홈페이지',
      icon: 'homepage',
      value: homepageUrl,
    },
  ]

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
              {contactInfo.map(info => (
                <div key={info.label} className={styles['contact-info-item']}>
                  <SvgIcon name={info.icon} size={24} />
                  <span>{info.label}</span>
                </div>
              ))}
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
