import { CheckBoxGroup } from '@/components/checkBox'
import styles from '@/container/baroTalk/common-selector.module.scss'
import { LAWYER_OPTIONS } from './constants'

const LawyerPreferenceSelector = () => {
  const handleStatusChange = (values: string[]) => {
    console.log('Selected values:', values)
  }

  return (
    <div className={styles['selector']}>
      <h1 className={styles['title']}>{`변호사\n타입 선택`}</h1>
      <div className={styles['group-wrapper']}>
        <CheckBoxGroup
          className={styles['item-wrapper']}
          options={LAWYER_OPTIONS.gender}
          name='consultationStatus'
          direction='horizontal'
          onChange={handleStatusChange}
        />
        <CheckBoxGroup
          className={styles['item-wrapper']}
          options={LAWYER_OPTIONS.tag}
          name='consultationStatus'
          direction='horizontal'
          onChange={handleStatusChange}
        />
        <CheckBoxGroup
          className={styles['item-wrapper']}
          options={LAWYER_OPTIONS.experience}
          name='consultationStatus'
          direction='horizontal'
          onChange={handleStatusChange}
        />
      </div>
    </div>
  )
}

export default LawyerPreferenceSelector
