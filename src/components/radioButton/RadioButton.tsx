import React, { useState } from 'react'
import styles from './radio-button.module.scss'

interface RadioOption {
  value: string
  label: string
}

interface RadioButtonProps {
  options: RadioOption[]
  name: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
  direction?: 'horizontal' | 'vertical'
  gap?: string | number
  gapUnit?: 'px' | 'rem'
}

const RadioButton = ({
  options,
  name,
  defaultValue,
  onChange,
  className,
  direction = 'vertical',
  gap = '1rem',
  gapUnit = 'rem',
  // 사용하지 않는 props는 _ prefix
  value: _value,
  label: _label,
  checked: _checked,
  disabled: _disabled,
}: RadioButtonProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || options[0]?.value || '')

  const handleChange = (value: string) => {
    setSelectedValue(value)
    onChange && onChange(value)
  }

  const getGapValue = (): string => {
    if (typeof gap === 'string') return gap

    if (gapUnit === 'px') {
      return `${gap}px`
    }
    return `${gap}rem`
  }

  const containerStyle = {
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: getGapValue(),
  } as React.CSSProperties

  return (
    <div className={`${styles['radio-container']} ${className || ''}`} style={containerStyle}>
      {options.map(option => (
        <label key={option.value} className={styles['radio-label']}>
          <input
            type='radio'
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => handleChange(option.value)}
            className={styles['radio-input']}
          />
          <span className={styles['radio-custom']}>
            {selectedValue === option.value && <span className={styles['radio-checked']} />}
          </span>
          <span className={styles['radio-text']}>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default RadioButton
