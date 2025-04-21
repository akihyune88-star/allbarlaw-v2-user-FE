import styles from '@/container/baroTalk/common-selector.module.scss'
import { RadioButtonGroup } from '@/components/radioButton'

const RequestTypeSelector = () => {
  const statusOptions = [
    { value: '상담만', label: '상담만' },
    { value: '의뢰예정', label: '의뢰예정' },
    { value: '고민중', label: '고민중' },
  ]

  const handleStatusChange = (value: string) => {
    // 여기서 상태 변경 처리를 할 수 있습니다
    console.log('Selected status:', value)
  }

  return (
    <div className={styles['selector']} style={{ display: 'flex', alignItems: 'center' }}>
      <h1 className={styles['title']}>{`상담후\n의뢰 여부`}</h1>
      <RadioButtonGroup
        className={styles['item-wrapper']}
        options={statusOptions}
        name='consultationStatus'
        defaultValue='판결 대기중'
        onChange={handleStatusChange}
        direction='horizontal'
        gap={36}
        gapUnit='px'
      />
    </div>
  )
}

export default RequestTypeSelector
