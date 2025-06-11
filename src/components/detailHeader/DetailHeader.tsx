import styles from '@/components/detailHeader/detail-header.module.scss'
import Button from '../button/Button'
import SvgIcon from '../SvgIcon'

type DetailHeaderProps = {
  title: string
  onShare?: () => void
  onSave?: () => void
}

const DetailHeader = ({ title, onShare, onSave }: DetailHeaderProps) => {
  return (
    <div className={styles['detail-header']}>
      <h1>{title}</h1>
      <div className={styles['button-wrapper']}>
        {onShare && (
          <Button variant='share' onClick={onShare}>
            공유
            <SvgIcon name='share' size={16} />
          </Button>
        )}
        {onSave && (
          <Button variant='save' onClick={onSave}>
            저장 <SvgIcon name='save' size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default DetailHeader
