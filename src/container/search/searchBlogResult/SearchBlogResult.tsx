import styles from './searchBlogResult.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'
import Divider from '@/components/divider/Divider'
import { SearchResponse } from '@/types/searchTypes'

type SearchBlogResultProps = {
  searchResults: SearchResponse['searchResults']['searchBlogResults']
}

const SearchBlogResult = ({ searchResults }: SearchBlogResultProps) => {
  return (
    <div className={styles['search-blog-result']}>
      {searchResults?.map((result, index) => (
        <>
          <BlogItem key={result.blogCaseId} item={result} />
          {index !== searchResults.length - 1 && <Divider padding={0} />}
        </>
      ))}
    </div>
  )
}

export default SearchBlogResult
