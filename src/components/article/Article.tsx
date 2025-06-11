import styles from '@/components/article/article.module.scss'

// 타입 정정 (retular -> regular)
type ArticleProps = {
  type: 'large' | 'small' | 'regular' | 'image' | 'xsmall' | 'xxlarge'
  thumbnailUrl?: string
  title: string
  content: string
  imageUrl?: string
  category?: string
  onClick?: () => void
  lawyerInfo: {
    name: string
    profileImageUrl: string
  }
  className?: string
}

const Article = ({
  type = 'regular',
  title,
  content,
  imageUrl,
  thumbnailUrl,
  onClick,
  category,
  className,
  lawyerInfo,
}: ArticleProps) => {
  const articleClass = [styles['article'], styles[`article-${type}`], className].filter(Boolean).join(' ')

  const renderArticle = () => {
    switch (type) {
      case 'image':
        return (
          <div className={styles['article-wrapper']} onClick={onClick}>
            <div className={articleClass}>
              {imageUrl && <img src={imageUrl} alt={title} className={styles.image} referrerPolicy='no-referrer' />}
              <h3 className={styles.title}>{title}</h3>
            </div>
          </div>
        )

      default:
        return (
          <article className={`${styles['article-wrapper']} ${articleClass}`} onClick={onClick}>
            <div className={styles['article-content']}>
              <header>
                {category && <span className={styles.category}>{category}</span>}
                <h3 className={styles.title}>{title}</h3>
              </header>
              <section>
                <p className={styles.content}>{content}</p>
              </section>
              <footer>
                <div className={styles.lawyer}>
                  <figure>
                    <img src={lawyerInfo.profileImageUrl} alt={lawyerInfo.name} referrerPolicy='no-referrer' />
                  </figure>
                  <span className={styles['lawyer-name']}>{lawyerInfo.name} 변호사</span>
                </div>
              </footer>
            </div>
            <figure className={styles['article-thumbnail']}>
              <img src={thumbnailUrl} alt='thumbnail' />
            </figure>
          </article>
        )
    }
  }

  return renderArticle()
}

export default Article
