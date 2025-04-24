import styles from '@/container/baroTalk/common-selector.module.scss'
import { RadioButtonGroup } from '@/components/radioButton'

const ConsultationStatusSelector = () => {
  const statusOptions = [
    { value: '모르겠음', label: '모르겠음' },
    { value: '일반문의', label: '일반문의' },
    { value: '진행중', label: '진행중' },
    { value: '판결 대기중', label: '판결 대기중' },
    { value: '종료', label: '종료' },
  ]

  const handleStatusChange = (value: string) => {
    // 여기서 상태 변경 처리를 할 수 있습니다
    console.log('Selected status:', value)
  }

  return (
    <div className={styles['selector']}>
      <h1 className={styles['title']}>진행 상태</h1>
      <RadioButtonGroup
        className={styles['item-wrapper']}
        options={statusOptions}
        name='consultationStatus'
        defaultValue='판결 대기중'
        onChange={handleStatusChange}
        direction='vertical'
        gap={24}
        gapUnit='px'
      />
    </div>
  )
}

export default ConsultationStatusSelector
