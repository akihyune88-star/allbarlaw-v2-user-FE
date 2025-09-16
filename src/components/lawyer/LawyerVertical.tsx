import React from 'react'
import styles from './lawyer-vertical.module.scss'
import Tag from '../tag/Tag'
import { blog, instagram, youtube } from '@/assets/imgs'
import ImageSlider from '../slider/imageSlider'
import Button from '../button/Button'
import SvgIcon from '../SvgIcon'
import { SocialLink, Tag as TagType } from '@/types/lawyerTypes'
import { COLOR } from '@/styles/color'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'

type LawyerVerticalProps = {
  lawyerId: number
  name: string
  lawfirm?: string
  profileImage: string | string[]
  type: 1 | 2 | 3
  blogUrl?: string
  youtubeUrl?: string
  instagramUrl?: string
  shareHandler?: () => void
  saveHandler?: () => void
  tags?: TagType[]
  footer?: React.ReactNode
  profileImageWidth?: string | number
  profileImageHeight?: string | number
  className?: string
  socialLink?: SocialLink[]
  isShare?: boolean
  isKeep?: boolean
}

const LawyerVertical = ({
  name,
  lawfirm,
  profileImage,
  type = 3,
  blogUrl,
  youtubeUrl,
  instagramUrl,
  tags,
  footer,
  className,
  profileImageWidth,
  profileImageHeight,
  isShare = false,
  isKeep = false,
  saveHandler,
  shareHandler,
  lawyerId,
}: LawyerVerticalProps) => {
  const navigate = useNavigate()
  const { setSearchQuery } = useSearchStore()

  const handleBaroTalk = () => {
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  const handleTagClick = (tag: TagType) => {
    setSearchQuery(tag.name)
    navigate(`/search/lawyer?tag=${tag.name}`)
  }

  return (
    <div className={`${styles['lawyer-vertical']} ${styles[`type-${type}`]} ${className}`}>
      {type === 2 ? (
        <ImageSlider
          images={profileImage as string[]}
          sliderSettings={{
            arrows: false,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true
          }}
          width={profileImageWidth}
          height={profileImageHeight}
          customDots={true}
        />
      ) : (
        <img src={profileImage as string} alt='변호사 프로필' style={{ borderRadius: 100, objectFit: 'cover' }} />
      )}
      <div className={styles['lawyer-info']}>
        <p className={styles.name}>{name} 변호사</p>
        {lawfirm && <p className={styles.lawfirm}>{lawfirm}</p>}
        {isShare && (
          <div className={styles['button-wrapper']}>
            <Button variant='share' onClick={shareHandler}>
              공유
              <SvgIcon name='share' size={16} />
            </Button>
            <Button variant='save' onClick={saveHandler}>
              저장 <SvgIcon name='save' size={16} fill={isKeep ? COLOR.green_01 : 'none'} />
            </Button>
          </div>
        )}

        {type === 2 && (
          <button className={styles['baro-talk-button']} onClick={handleBaroTalk}>
            바로 톡
          </button>
        )}

        <div className={styles['social-link-wrapper']}>
          <div className={styles['social-link']}>
            {blogUrl && (
              <img
                src={blog}
                alt='블로그'
                className={styles['social-link-img']}
                onClick={() => window.open(blogUrl, '_blank')}
              />
            )}
            {youtubeUrl && (
              <img
                src={youtube}
                alt='유튜브'
                className={styles['social-link-img']}
                onClick={() => window.open(youtubeUrl, '_blank')}
              />
            )}
            {instagramUrl && (
              <img
                src={instagram}
                alt='인스타그램'
                className={styles['social-link-img']}
                onClick={() => window.open(instagramUrl, '_blank')}
              />
            )}
          </div>
          {tags && (
            <div className={styles['tag-list']}>
              {tags.map(tagItem => (
                <Tag tag={tagItem.name} key={tagItem.id} onClick={() => handleTagClick(tagItem)} />
              ))}
            </div>
          )}
        </div>
      </div>
      <footer>{footer}</footer>
    </div>
  )
}

export default LawyerVertical
