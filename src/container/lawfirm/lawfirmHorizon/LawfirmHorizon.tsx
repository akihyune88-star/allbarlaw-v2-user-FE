import { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'
import Tag from '@/components/tag/Tag'
import { AlertModal } from '@/components/modal/Modal'
import { formatPhoneNumber } from '@/utils/formatUtils'
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  const handleBlogClick = () => {
    if (blogUrl) {
      trackView(lawfirmId)
      window.open(blogUrl, '_blank')
    }
  }

  const handleHomepageClick = () => {
    if (homepageUrl) {
      trackView(lawfirmId)
      window.open(homepageUrl, '_blank')
    }
  }

  const handleAddressClick = () => {
    trackView(lawfirmId)
    setIsAddressModalOpen(true)
  }

  const handlePhoneClick = () => {
    trackView(lawfirmId)
    setIsPhoneModalOpen(true)
  }

  const handleTagClick = (url: string) => {
    trackView(lawfirmId)
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
                <button className={styles['contact-info-item']} onClick={handleBlogClick}>
                  <SvgIcon name={'blog'} size={24} />
                  <span>블로그</span>
                </button>
              )}
              {homepageUrl && (
                <button className={styles['contact-info-item']} onClick={handleHomepageClick}>
                  <SvgIcon name={'homepage'} size={24} />
                  <span>홈페이지</span>
                </button>
              )}
              {address && (
                <button className={styles['contact-info-item']} onClick={handleAddressClick}>
                  <SvgIcon name={'map'} size={24} />
                  <span>위치</span>
                </button>
              )}
              {phoneNumber && (
                <button className={styles['contact-info-item']} onClick={handlePhoneClick}>
                  <SvgIcon name={'call'} size={24} />
                  <span>연락처</span>
                </button>
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
            linkList.map(link => (
              <Tag
                key={link.lawfirmDirectId}
                tag={link.lawfirmDirectName}
                onClick={() => handleTagClick(link.lawfirmDirectLink)}
              />
            ))}
        </div>
      </div>

      {/* 위치 모달 */}
      <AlertModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        message={address || ''}
        confirmText='확인'
      />

      {/* 연락처 모달 */}
      <AlertModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        message={formatPhoneNumber(phoneNumber)}
        confirmText='확인'
      />
    </article>
  )
}
export default LawfirmHorizon
