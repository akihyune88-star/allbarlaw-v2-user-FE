import React from 'react'
import CheckBox from './CheckBox'
import styles from './check-box-group.module.scss'

interface CheckOption {
  value: string
  label: string
}

interface CheckBoxGroupProps {
  options: CheckOption[]
  name: string
  values: string[]
  onChange: (values: string[]) => void
  className?: string
  direction?: 'horizontal' | 'vertical'
  gap?: string | number
}

const CheckBoxGroup = ({
  options,
  name,
  values,
  onChange,
  className,
  direction = 'vertical',
  gap = '1rem',
}: CheckBoxGroupProps) => {
  const handleChange = (value: string) => {
    const newValues = values.includes(value) ? values.filter(v => v !== value) : [...values, value]
    onChange(newValues)
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: typeof gap === 'number' ? `${gap}rem` : gap,
  } as React.CSSProperties

  return (
    <div className={className} style={containerStyle}>
      {options.map(option => (
        <label key={option.value} className={styles['checkbox-label']}>
          <CheckBox
            name={name}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={() => handleChange(option.value)}
          />
          <span className={styles['checkbox-text']}>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default CheckBoxGroup
