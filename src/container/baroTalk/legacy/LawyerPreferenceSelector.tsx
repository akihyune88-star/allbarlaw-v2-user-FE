// import { CheckBoxGroup } from '@/components/checkBox'
import styles from '@/container/baroTalk/common-selector.module.scss'
// import { LAWYER_OPTIONS } from './constants'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const LawyerPreferenceSelector = () => {
  const isMobile = useMediaQuery('(max-width: 1279px)')

  // const handleStatusChange = (values: string[]) => {
  //   console.log('Selected values:', values)
  // }

  return (
    <div className={`${styles['selector']} ${styles['flex-center']}`}>
      <h1 className={styles['title']} style={{ marginBottom: isMobile ? 16 : 0 }}>{`변호사\n타입 선택`}</h1>
      <div className={styles['group-wrapper']}>
        {/* <CheckBoxGroup
          className={styles['item-wrapper']}
          options={LAWYER_OPTIONS.gender}
          name='consultationStatus'
          direction={isMobile ? 'vertical' : 'horizontal'}
          onChange={handleStatusChange}
          gap={isMobile ? 0.75 : 2.25}
        />
        {isMobile && <hr className={styles.divider} />}
        <CheckBoxGroup
          className={styles['item-wrapper']}
          options={LAWYER_OPTIONS.tag}
          name='consultationStatus'
          direction={isMobile ? 'vertical' : 'horizontal'}
          onChange={handleStatusChange}
          gap={isMobile ? 0.75 : 2.25}
        />
        {isMobile && <hr className={styles.divider} />}
        <CheckBoxGroup
          className={styles['item-wrapper']}
          options={LAWYER_OPTIONS.experience}
          name='consultationStatus'
          direction={isMobile ? 'vertical' : 'horizontal'}
          onChange={handleStatusChange}
          gap={isMobile ? 0.75 : 2.25}
        /> */}
      </div>
    </div>
  )
}

export default LawyerPreferenceSelector
