import styles from './divider.module.scss'

interface DividerProps {
  padding?: number
  className?: string
}

const Divider = ({ padding = 16, className }: DividerProps) => {
  return <div className={`${styles.divider} ${className || ''}`} style={{ margin: `${padding}px 0` }} />
}

export default Divider
