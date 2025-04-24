import styles from '@/components/lawyer/lawyer-horizon.module.scss'
import Tag from '../tag/Tag'
import SvgIcon from '../SvgIcon'

type LawyerHorizonProps = {
  name: string
  profileImage: string
  description: string
  lawfirm?: string
  tags?: string[]
  size?: 'x-small' | 'small' | 'large'
  className?: string
  onClick?: () => void
  selected?: boolean
}

const LawyerHorizon = ({
  name,
  profileImage,
  description,
  lawfirm,
  tags,
  size = 'small',
  className,
  onClick,
  selected = false,
}: LawyerHorizonProps) => {
  return (
    <div
      className={`${styles['lawyer-horizon']} ${styles[size]} ${selected ? styles['selected'] : ''} ${className}`}
      onClick={onClick}
    >
      <div className={styles['lawyer-horizon-image']}>
        <img src={profileImage} alt='변호사 프로필' />
        {selected && <SvgIcon name='checkRound' size={16} />}
      </div>
      <div className={styles['lawyer-horizon-content']}>
        <div>
          <span className={styles['name']}>{name}</span>
          {lawfirm && <span className={styles['lawfirm']}>{lawfirm}</span>}
        </div>
        <p className={styles['description']}>{description}</p>
        {tags && tags.length > 0 && (
          <div className={styles['tags']}>
            {tags.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LawyerHorizon
