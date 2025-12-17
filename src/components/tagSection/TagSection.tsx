import { Tag } from '@/types/lawyerTypes'
import styles from './tag-section.module.scss'

type TagSectionProps = {
  title: string
  tags: Tag[] | []
  className?: string
  onTagClick?: (tag: string) => void
}

const TagSection = ({ title, tags, className, onTagClick }: TagSectionProps) => {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <section className={`${styles['tag-section']} ${className || ''}`}>
      <h3 className={styles['tag-section-title']}>{title}</h3>
      <hr className={styles['tag-section-divider']} />
      <ul className={styles['tag-list']}>
        {tags.map(tag => (
          <li key={tag.id}>
            <button type='button' className={styles['tag-item']} onClick={() => onTagClick?.(tag.name)}>
              #{tag.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TagSection
