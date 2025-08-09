import { BlogCase } from '@/types/blogTypes'
import SearchSectionHeader from '../searchSectionHeader/SearchSectionHeader'
import styles from './totalSearchBlogList.module.scss'
import Article from '@/components/article/Article'
import { useNavigate } from 'react-router-dom'

interface TotalSearchBlogListProps {
  searchResults: BlogCase[]
  query: string
}

const TotalSearchBlogList = ({ searchResults, query }: TotalSearchBlogListProps) => {
  const navigate = useNavigate()

  const handleClickMore = () => {
    navigate(`/search/blog?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className={styles['total-search-blog-list']}>
      <SearchSectionHeader title='법률정보의 글' onClickMore={handleClickMore} />
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
              lawfirmName: blog.lawfirmName,
              profileImageUrl: blog.lawyerProfileImage,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TotalSearchBlogList
