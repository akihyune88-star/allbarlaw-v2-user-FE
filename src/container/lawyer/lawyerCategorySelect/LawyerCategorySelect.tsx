import styles from './lawyerCategorySelect.module.scss'
import { CategoryList } from '@/types/categoryTypes'

interface LawyerCategorySelectProps {
  categories: { categoryId: number; subcategoryId: number | null }[]
  categoryList: CategoryList | undefined
  errors: Record<string, string>
  onAddCategory: () => void
  onRemoveCategory: (_index: number) => void
  onCategoryChange: (_index: number, _field: 'categoryId' | 'subcategoryId', _value: number | null) => void
}

const LawyerCategorySelect = ({
  categories,
  categoryList,
  errors,
  onAddCategory,
  onRemoveCategory,
  onCategoryChange,
}: LawyerCategorySelectProps) => {
  return (
    <div className={styles.formRow}>
      <div className={styles.labelCol}>
        <label className={styles.label}>
          주요분야 선택
          <br />
          <span className={styles.helperText} style={{ fontSize: 12 }}>
            (최소1개/최대20개)
          </span>
        </label>
      </div>
      <div className={styles.inputCol}>
        <div className={styles.categoryList}>
          {categories.map((category, index) => {
            const selectedCategory = categoryList?.find(c => c.categoryId === category.categoryId)
            const isLastItem = index === categories.length - 1
            return (
              <div key={index} className={styles.categoryItem}>
                <select
                  className={`${styles.select} ${styles.selectMain}`}
                  value={category.categoryId || ''}
                  onChange={e => onCategoryChange(index, 'categoryId', Number(e.target.value))}
                >
                  <option value=''>대분류 선택</option>
                  {categoryList?.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <select
                  className={`${styles.select} ${styles.selectSub}`}
                  value={category.subcategoryId || ''}
                  onChange={e => onCategoryChange(index, 'subcategoryId', Number(e.target.value))}
                  disabled={!category.categoryId}
                >
                  <option value=''>소분류 선택</option>
                  {selectedCategory?.subcategories?.map(sub => (
                    <option key={sub.subcategoryId} value={sub.subcategoryId}>
                      {sub.subcategoryName}
                    </option>
                  ))}
                </select>
                {categories.length > 1 && (
                  <button type='button' className={styles.removeButton} onClick={() => onRemoveCategory(index)}>
                    삭제
                  </button>
                )}
                {isLastItem && categories.length < 20 && (
                  <button type='button' className={styles.addButton} onClick={onAddCategory}>
                    분야추가
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {categories.length === 0 && (
          <button type='button' className={styles.addButton} onClick={onAddCategory}>
            분야추가
          </button>
        )}
        {errors.categories && <div className={styles.error}>{errors.categories}</div>}
        <div className={styles.helperText}>최소 1개 이상의 주요분야를 선택해주세요.</div>
      </div>
    </div>
  )
}

export default LawyerCategorySelect
