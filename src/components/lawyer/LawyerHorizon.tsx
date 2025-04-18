import styles from '@/components/lawyer/lawyer-horizon.module.scss'

type LawyerHorizonProps = {
  name: string
  profileImage: string
  description: string
  lawfirm?: string
  tags?: string[]
  size?: 'x-small' | 'small' | 'large'
}

const LawyerHorizon = ({ name, profileImage, description, lawfirm, tags, size = 'small' }: LawyerHorizonProps) => {
  return (
    <div className={`${styles['lawyer-horizon']} ${styles[size]}`}>
      <img src={profileImage} alt='변호사 프로필' />
      <div>
        <div>
          <span className={styles['name']}>{name}</span>
          {lawfirm && <span className={styles['lawfirm']}>{lawfirm}</span>}
        </div>
        <p className={styles['description']}>{description}</p>
        {tags && tags.length > 0 && (
          <div>
            {tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LawyerHorizon
