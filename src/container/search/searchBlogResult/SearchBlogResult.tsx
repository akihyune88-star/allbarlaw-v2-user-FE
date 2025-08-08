import styles from './searchBlogResult.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'
import { SearchResponse } from '@/types/searchTypes'

type SearchBlogResultProps = {
  searchResults: SearchResponse['searchResults']['searchBlogResults']
}

const SearchBlogResult = ({ searchResults }: SearchBlogResultProps) => {
  return (
    <div className={styles['search-blog-result']}>
      {searchResults?.map(result => (
        <BlogItem key={result.blogCaseId} item={result} />
      ))}
    </div>
  )
}

export default SearchBlogResult
