import styles from '@/components/legalTermWidget/legal-term-widget.module.scss'
import SvgIcon from '../SvgIcon'

type LegalTermWidgetProps = {
  lagalTermList: string[]
}

const LegalTermWidget = ({ lagalTermList }: LegalTermWidgetProps) => {
  return (
    <div className={styles['legal-term-widget']}>
      <h1>법률 사전</h1>
      <div className={styles['tag-list']}>
        {lagalTermList.map((term, index) => (
          <p key={term + index}>{term}</p>
        ))}
      </div>
      <button>
        <span>더보기</span>
        <SvgIcon name='arrowSmall' />
      </button>
    </div>
  )
}

export default LegalTermWidget
