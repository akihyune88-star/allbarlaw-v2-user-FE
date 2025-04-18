import styles from './divider.module.scss'

interface DividerProps {
  paddingTop?: number
  paddingBottom?: number
  className?: string
}

const Divider = ({ paddingTop = 16, paddingBottom = 16, className }: DividerProps) => {
  return (
    <div
      className={`${styles.divider} ${className || ''}`}
      style={{
        marginTop: `${paddingTop}px`,
        marginBottom: `${paddingBottom}px`,
      }}
    />
  )
}

export default Divider
