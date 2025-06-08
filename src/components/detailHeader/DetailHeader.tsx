import styles from '@/components/detailHeader/detail-header.module.scss'
import Button from '../button/Button'
import SvgIcon from '../SvgIcon'

type DetailHeaderProps = {
  title: string
}

const DetailHeader = ({ title }: DetailHeaderProps) => {
  return (
    <div className={styles['detail-header']}>
      <h1>{title}</h1>
      <div className={styles['button-wrapper']}>
        <Button variant='share'>
          공유
          <SvgIcon name='share' size={16} />
        </Button>
        <Button variant='save'>
          저장 <SvgIcon name='save' size={16} />
        </Button>
      </div>
    </div>
  )
}

export default DetailHeader
