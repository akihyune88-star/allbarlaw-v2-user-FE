import Divider from '../divider/Divider'
import SvgIcon from '../SvgIcon'
import styles from './legal-item-widget.module.scss'

interface LegalItemWidgetProps {
  title: string
  onRefresh?: () => void
}

const LegalItemWidget = ({ title, onRefresh }: LegalItemWidgetProps) => {
  return (
    <section className={styles.container}>
      <div className={styles['header']}>
        <h3 className={styles['title']}>{title}</h3>
        <SvgIcon name='refresh' onClick={onRefresh} />
      </div>
      <Divider padding={16} />
      <div className={styles['content']}>
        {LegalItemList.map(item => (
          <div className={styles['item']} key={item.title}>
            <h4 className={styles['item-title']}>{item.title}</h4>
            <p className={styles['item-discription']}>{item.discription}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LegalItemWidget

const LegalItemList = [
  {
    title: '업무방해죄 [業務妨害罪]',
    discription:
      '허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄 허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄',
  },
  {
    title: '업무방해죄 [業務妨害罪]',
    discription:
      '허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄 허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄',
  },
  {
    title: '업무방해죄 [業務妨害罪]',
    discription:
      '허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄 허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄',
  },
  {
    title: '업무방해죄 [業務妨害罪]',
    discription:
      '허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄 허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄',
  },
  {
    title: '업무방해죄 [業務妨害罪]',
    discription:
      '허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄 허위 사실을 유포하거나 위계 또는 위력으로써 사람의 업무를 방해하는 범죄',
  },
]
