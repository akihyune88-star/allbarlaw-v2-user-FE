import styles from '@/components/tag/tag.module.scss'

const Tag = ({ tag, onClick }: { tag: string; onClick?: () => void }) => {
  return (
    <span className={styles['tag']} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {tag}
    </span>
  )
}

export default Tag
