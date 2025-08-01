import RadioButton from './RadioButton'
import styles from './radio-button-group.module.scss'

interface RadioButtonGroupProps {
  title?: string
  options: Array<{ value: string; label: string }>
  name: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
  direction?: 'horizontal' | 'vertical'
  gap?: string | number
  gapUnit?: 'px' | 'rem'
}

const RadioButtonGroup = ({
  title,
  options,
  name,
  defaultValue,
  onChange,
  className,
  direction = 'vertical',
  gap = '1rem',
  gapUnit = 'rem',
}: RadioButtonGroupProps) => {
  return (
    <div className={`${styles['radio-group']} ${className || ''}`}>
      {title && <h3 className={styles['radio-group-title']}>{title}</h3>}
      <RadioButton
        options={options}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        direction={direction}
        gap={gap}
        gapUnit={gapUnit}
      />
    </div>
  )
}

export default RadioButtonGroup
