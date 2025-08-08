import styles from '@/components/detailHeader/detail-header.module.scss'
import Button from '../button/Button'
import SvgIcon from '../SvgIcon'
import { COLOR } from '@/styles/color'

type DetailHeaderProps = {
  title: string
  onShare?: () => void
  onSave?: () => void
  isKeep?: boolean
}

const DetailHeader = ({ title, onShare, onSave, isKeep }: DetailHeaderProps) => {
  console.log('isKeep', isKeep)
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
            저장 <SvgIcon name='save' size={16} fill={isKeep ? COLOR.icon_darkgreen : 'none'} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default DetailHeader
