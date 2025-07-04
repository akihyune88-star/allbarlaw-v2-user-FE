import React from 'react'
import styles from './check-box.module.scss'

// 단일 체크박스를 위한 Props
type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

// 단일 CheckBox 컴포넌트
const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(({ ...rest }, ref) => {
  return (
    <label className={styles['checkbox-wrapper']}>
      <input type='checkbox' className={styles['checkbox-input']} ref={ref} {...rest} />
      <span className={styles['checkbox-custom']}></span>
    </label>
  )
})
CheckBox.displayName = 'CheckBox'
export default CheckBox
