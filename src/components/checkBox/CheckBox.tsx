import React, { useState, useEffect } from 'react'
import styles from './check-box.module.scss'
import SvgIcon from '../SvgIcon'

interface CheckOption {
  value: string
  label: string
}

interface CheckBoxProps {
  options: CheckOption[]
  name: string
  defaultValues?: string[]
  onChange?: (values: string[]) => void
  className?: string
  direction?: 'horizontal' | 'vertical'
  gap?: string | number
  gapUnit?: 'px' | 'rem'
}

const CheckBox = ({
  options,
  name,
  defaultValues = [],
  onChange,
  className,
  direction = 'vertical',
  gap = '1rem',
  gapUnit = 'rem',
}: CheckBoxProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues)

  useEffect(() => {
    // defaultValues가 변경되면 selectedValues 업데이트
    setSelectedValues(defaultValues)
  }, [defaultValues])

  const handleChange = (value: string) => {
    let newValues: string[]

    if (selectedValues.includes(value)) {
      // 이미 선택된 항목이면 제거
      newValues = selectedValues.filter(v => v !== value)
    } else {
      // 선택되지 않은 항목이면 추가
      newValues = [...selectedValues, value]
    }

    setSelectedValues(newValues)
    onChange && onChange(newValues)
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
    <div className={`${styles['checkbox-container']} ${className || ''}`} style={containerStyle}>
      {options.map(option => (
        <label key={option.value} className={styles['checkbox-label']}>
          <input
            type='checkbox'
            name={name}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value)}
            className={styles['checkbox-input']}
          />
          <span className={styles['checkbox-custom']}>
            {selectedValues.includes(option.value) && (
              <span className={styles['checkbox-checked']}>
                <SvgIcon name='check' color={'white'} size={16} />
              </span>
            )}
          </span>
          <span className={styles['checkbox-text']}>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default CheckBox
