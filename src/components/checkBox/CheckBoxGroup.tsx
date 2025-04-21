import CheckBox from './CheckBox'
import styles from './check-box-group.module.scss'

interface CheckBoxGroupProps {
  title?: string
  options: Array<{ value: string; label: string }>
  name: string
  defaultValues?: string[]
  onChange?: (values: string[]) => void
  className?: string
  direction?: 'horizontal' | 'vertical'
  gap?: string | number
  gapUnit?: 'px' | 'rem'
}

const CheckBoxGroup = ({
  title,
  options,
  name,
  defaultValues = [],
  onChange,
  className,
  direction = 'vertical',
  gap = '1rem',
  gapUnit = 'rem',
}: CheckBoxGroupProps) => {
  return (
    <div className={`${styles['checkbox-group']} ${className || ''}`}>
      {title && <h3 className={styles['checkbox-group-title']}>{title}</h3>}
      <CheckBox
        options={options}
        name={name}
        defaultValues={defaultValues}
        onChange={onChange}
        direction={direction}
        gap={gap}
        gapUnit={gapUnit}
      />
    </div>
  )
}

export default CheckBoxGroup
