import React, { useState, useRef, useEffect } from 'react'
import styles from './select-box.module.scss'
import SvgIcon from '../SvgIcon'

export type SelectOption<T = string> = {
  value: T
  label: string
}

type SelectBoxProps<T = string> = {
  options: SelectOption<T>[]
  value?: T
  onChange?: (value: T) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  width?: string | number
}

const SelectBox = <T extends string | number = string>({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  className,
  disabled = false,
  width,
}: SelectBoxProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<T | undefined>(value)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: T) => {
    setSelectedValue(optionValue)
    setIsOpen(false)
    onChange?.(optionValue)
  }

  const selectedOption = options.find(option => option.value === selectedValue)

  return (
    <div
      ref={selectRef}
      className={`${styles.selectBox} ${className || ''} ${disabled ? styles.disabled : ''}`}
      style={{ width }}
    >
      <button
        type='button'
        className={`${styles.selectButton} ${isOpen ? styles.open : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedOption ? styles.selected : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <SvgIcon name='arrowSmall' size={20} className={`${styles.icon} ${isOpen ? styles.rotated : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.optionsList}>
          {options.map(option => (
            <button
              key={String(option.value)}
              type='button'
              className={`${styles.option} ${option.value === selectedValue ? styles.active : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectBox
