import { Tag } from '@/types/lawyerTypes'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'
import { ROUTER } from '@/routes/routerConstant'
import styles from './tag-section.module.scss'

type TagSectionProps = {
  title: string
  tags: Tag[] | []
  className?: string
}

const TagSection = ({ title, tags, className }: TagSectionProps) => {
  const navigate = useNavigate()
  const { setSearchQuery } = useSearchStore()

  if (!tags || tags.length === 0) {
    return null
  }

  const handleTagClick = (tagName: string) => {
    setSearchQuery(tagName)
    navigate(ROUTER.SEARCH_MAIN)
  }

  return (
    <section className={`${styles['tag-section']} ${className || ''}`}>
      <h3 className={styles['tag-section-title']}>{title}</h3>
      <hr className={styles['tag-section-divider']} />
      <ul className={styles['tag-list']}>
        {tags.map(tag => (
          <li key={tag.id}>
            <button type='button' className={styles['tag-item']} onClick={() => handleTagClick(tag.name)}>
              #{tag.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TagSection
