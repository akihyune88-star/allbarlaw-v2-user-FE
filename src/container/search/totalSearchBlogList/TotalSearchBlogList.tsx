import { BlogCase } from '@/types/blogTypes'
import SearchSectionHeader from '../searchSectionHeader/SearchSectionHeader'
import styles from './totalSearchBlogList.module.scss'
import Article from '@/components/article/Article'

interface TotalSearchBlogListProps {
  searchResults: BlogCase[]
}

const TotalSearchBlogList = ({ searchResults }: TotalSearchBlogListProps) => {
  console.log('searchResults', searchResults)

  const handleClickMore = () => {
    console.log('더보기')
  }

  return (
    <div className={styles['total-search-blog-list']}>
      <SearchSectionHeader title='블로그' onClickMore={handleClickMore} />
      <div className={styles['blog-list']}>
        {searchResults.map(blog => (
          <Article
            key={blog.blogCaseId}
            type='xsmall'
            thumbnailUrl={blog.thumbnail}
            title={blog.title}
            content={blog.summaryContent}
            lawyerInfo={{
              name: blog.lawyerName,
              profileImageUrl: blog.lawyerProfileImage,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TotalSearchBlogList
