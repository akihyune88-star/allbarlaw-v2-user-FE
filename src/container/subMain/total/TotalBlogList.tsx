import Article from '@/components/article/Article'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import styles from '@/container/subMain/total/total-blog-list.module.scss'
import { useBlogCount } from '@/hooks/queries/useBlogCount'
import { useCategoryStore } from '@/store/useCategoryStore'

const TotalBlogList = () => {
  const mapItem = [1, 2, 3, 4]
  const { subcategory } = useCategoryStore()
  const { data: blogCount } = useBlogCount({ subCategoryId: subcategory?.subcategoryId || 'all', recentDays: 30 })

  console.log(blogCount)

  return (
    <div className={styles['total-blog-list']}>
      <ArticleHeader title='변호사의 글' totalBlogCount={10} recentBlogCount={10} type='total' />
      <div className={styles['blog-list']}>
        {mapItem.map(blogNumber => (
          <Article
            key={blogNumber}
            type='xsmall'
            thumbnailUrl='https://dimg.donga.com/wps/NEWS/IMAGE/2023/05/24/119463126.1.jpg'
            title='주차장 음주운전, 잠깐의 방심으로 억울하게 처벌받을 위기 어떻게 해야 할까? 주차장 음주운전, 잠깐의 방심으로 억울하게 처벌받을 위기 어떻게 해야 할까?'
            content='음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어
          음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어...'
            category='부동산'
            lawyerInfo={{
              name: '양정아',
              profileImageUrl: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TotalBlogList
