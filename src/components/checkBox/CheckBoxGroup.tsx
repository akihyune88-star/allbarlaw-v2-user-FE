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
  onChange: (_values: string[]) => void
  className?: string
  direction?: 'horizontal' | 'vertical'
  gap?: string | number
}

const CheckBoxGroup = ({
  values: _values,
  options,
  name,
  onChange,
  className,
  // 사용하지 않는 props는 _ prefix
  direction: _direction = 'vertical',
  gap: _gap = '1rem',
}: CheckBoxGroupProps) => {
  const handleChange = (value: string) => {
    const newValues = _values.includes(value) ? _values.filter(v => v !== value) : [..._values, value]
    onChange(newValues)
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties

  return (
    <div className={className} style={containerStyle}>
      {options.map(option => (
        <label key={option.value} className={styles['checkbox-label']}>
          <CheckBox
            name={name}
            value={option.value}
            checked={_values.includes(option.value)}
            onChange={() => handleChange(option.value)}
          />
          <span className={styles['checkbox-text']}>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default CheckBoxGroup
