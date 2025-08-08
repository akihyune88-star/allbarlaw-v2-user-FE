import BlogItem from '@/components/blogItem/BlogItem'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './myBlogList.module.scss'
import Divider from '@/components/divider/Divider'
import React from 'react'
import { useInfiniteMyBlogList } from '@/hooks/queries/useMypage'
import { BlogCase } from '@/types/blogTypes'
import { useNavigate } from 'react-router-dom'

const MyBlogList = ({ sort }: { sort: 'asc' | 'desc' }) => {
  const navigate = useNavigate()

  const { blogList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteMyBlogList({
    take: 10,
    sort: sort,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  if (isLoading) {
    return <div className={styles.myBlogList}>로딩 중...</div>
  }

  const handleBlogDetail = (blog: BlogCase) => {
    navigate(`/${blog.subcategoryId}/blog/${blog.blogCaseId}`)
  }

  return (
    <div className={styles.myBlogList}>
      {blogList.map((blog, idx) => (
        <React.Fragment key={blog.blogCaseId}>
          <BlogItem type='regular' item={blog} summaryButton={true} onClick={() => handleBlogDetail(blog)} />
          {idx !== blogList.length - 1 && <Divider className={styles.divider} />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default MyBlogList
