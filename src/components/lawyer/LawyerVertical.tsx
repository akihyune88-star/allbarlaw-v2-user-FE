import React from 'react'
import styles from './lawyer-vertical.module.scss'
import SvgIcon from '../SvgIcon'
import { KeyOfIcon } from '@/types/svg'
import Tag from '../tag/Tag'
import { SocialLink } from '@/types/lawyerTypes'

type LawyerVerticalProps = {
  name: string
  lawfirm?: string
  profileImage: string
  type: 1 | 2 | 3
  socialLink?: SocialLink[]
  tags?: string[]
  footer?: React.ReactNode
}

const LawyerVertical = ({ name, lawfirm, profileImage, type = 3, socialLink, tags, footer }: LawyerVerticalProps) => {
  return (
    <div className={`${styles['lawyer-vertical']} ${styles[`type-${type}`]}`}>
      <img src={profileImage} alt='변호사 프로필' style={{ borderRadius: 100, objectFit: 'cover' }} />
      <div className={styles['lawyer-info']}>
        <p className={styles.name}>{name} 변호사</p>
        {lawfirm && <p className={styles.lawfirm}>{lawfirm}</p>}
        {socialLink && (
          <div className={styles['social-link']}>
            {socialLink.map(link => (
              <SvgIcon name={link.type as KeyOfIcon} size={24} key={link.type} />
            ))}
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
