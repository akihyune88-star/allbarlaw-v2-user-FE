import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './legalCurationService.module.scss'
import { useCategory } from '@/hooks/queries/useCategory'
import { useNavigate } from 'react-router-dom'
import { forwardRef } from 'react'

const LegalCurationService = forwardRef<HTMLDivElement>((_props, ref) => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { data: categoryList } = useCategory()

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/${categoryId}`)
  }

  return (
    <section className={styles['legal-curation-service']} ref={ref}>
      <h2 className={styles['legal-curation-service-title']}>법률정보 큐레이션 서비스</h2>
      <article className={styles['legal-curation-service-article']}>
        <div className={styles['legal-curation-service-article-right']}>
          {!isMobile
            ? `당신이 궁금하던 법률정보,\n올바로와 함께\n알아보세요.`
            : '당신이 궁금하던 법률정보,\n올바로와 함께 알아보세요.'}
        </div>
        <div>
          <p className={styles['legal-curation-service-article-right-description']}>
            {`당신의 고민이 올바로의 전문성과 만날 때,
            명확한 해답의 길이 열립니다.
            수많은 법률 정보 속에서 꼭 필요한 지식만을 골라
            신뢰할 수 있는 전문가와 연결해드립니다\n`}
            <strong>지금, 법률의 새로운 탐색을 시작해 보세요.</strong>
          </p>
        </div>
      </article>
      <article className={styles['legal-curation-service-image']}>
        {categoryList?.map(category => (
          <button
            key={category.categoryId}
            className={styles['legal-curation-service-image-item']}
            onClick={() => handleCategoryClick(category.subcategories[0].subcategoryId)}
          >
            <img src={category.clickedImageUrl} alt={category.categoryName} />
            <span>{category.categoryName}</span>
          </button>
        ))}
      </article>
    </section>
  )
})

LegalCurationService.displayName = 'LegalCurationService'

export default LegalCurationService
