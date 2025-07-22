import BlogItem from '@/components/blogItem/BlogItem'
import { useInfiniteBlogList } from '@/hooks/queries/useGetBlogList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './myBlogList.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'
import React from 'react'

const MyBlogList = () => {
  const { blogList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteBlogList({
    subcategoryId: 'all',
    take: 4,
    // orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  const isMobile = useMediaQuery('(max-width: 80rem)')

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetching: isFetchingNextPage,
    fetchNextPage,
  })

  if (isLoading) {
    return <div className={styles.myBlogList}>로딩 중...</div>
  }

  return (
    <div className={styles.myBlogList}>
      {blogList.map((blog, idx) => (
        <React.Fragment key={blog.blogCaseId}>
          <BlogItem item={blog} viewKeepBookmark={true} />
          {!isMobile && idx !== blogList.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default MyBlogList
