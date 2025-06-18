import React from 'react'
import styles from './lawyer-vertical.module.scss'
import SvgIcon from '../SvgIcon'
import { KeyOfIcon } from '@/types/svg'
import Tag from '../tag/Tag'
import { SocialLink } from '@/types/lawyerTypes'
import { blog, instagram, youtube } from '@/assets/imgs'

type LawyerVerticalProps = {
  name: string
  lawfirm?: string
  profileImage: string
  type: 1 | 2 | 3
  socialLink?: SocialLink[]
  tags?: string[]
  footer?: React.ReactNode
  className?: string
}

const LawyerVertical = ({
  name,
  lawfirm,
  profileImage,
  type = 3,
  socialLink,
  tags,
  footer,
  className,
}: LawyerVerticalProps) => {
  return (
    <div className={`${styles['lawyer-vertical']} ${styles[`type-${type}`]} ${className}`}>
      <img src={profileImage} alt='변호사 프로필' style={{ borderRadius: 100, objectFit: 'cover' }} />
      <div className={styles['lawyer-info']}>
        <p className={styles.name}>{name} 변호사</p>
        {lawfirm && <p className={styles.lawfirm}>{lawfirm}</p>}
        {socialLink && (
          <div className={styles['social-link']}>
            <img src={blog} alt='블로그' className={styles['social-link-img']} />
            <img src={youtube} alt='유튜브' className={styles['social-link-img']} />
            <img src={instagram} alt='인스타그램' className={styles['social-link-img']} />
          </div>
        )}
        {tags && (
          <div className={styles['tag-list']}>
            {tags.map(tagItem => (
              <Tag tag={tagItem} key={tagItem} />
            ))}
          </div>
        )}
      </div>
      <footer>{footer}</footer>
    </div>
  )
}

export default LawyerVertical
