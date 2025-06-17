import styles from '@/container/baroTalk/common-selector.module.scss'
import { RadioButtonGroup } from '@/components/radioButton'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const RequestTypeSelector = () => {
  const statusOptions = [
    { value: '상담만', label: '상담만' },
    { value: '의뢰예정', label: '의뢰예정' },
    { value: '고민중', label: '고민중' },
  ]

  // useMediaQuery 훅을 사용하여 모바일 여부 체크
  const isMobile = useMediaQuery('(max-width: 1279px)')

  const handleStatusChange = (value: string) => {
    // 여기서 상태 변경 처리를 할 수 있습니다
    console.log('Selected status:', value)
  }

  return (
    <div className={`${styles['selector']} ${styles['flex-center']}`}>
      <h1 className={styles['title']} style={{ marginBottom: isMobile ? 16 : 0 }}>{`상담후\n의뢰 여부`}</h1>
      <RadioButtonGroup
        className={styles['item-wrapper']}
        options={statusOptions}
        name='consultationStatus'
        onChange={handleStatusChange}
        direction={isMobile ? 'vertical' : 'horizontal'}
        gap={isMobile ? 24 : 36}
        gapUnit='px'
      />
    </div>
  )
}

export default RequestTypeSelector
