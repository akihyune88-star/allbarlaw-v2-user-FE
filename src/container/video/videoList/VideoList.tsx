import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Divider from '@/components/divider/Divider'
import VideoHorizon from '@/components/video/VideoHorizon'
import styles from './video-list.module.scss'
import { useInfiniteVideoList } from '@/hooks/queries/useGetVideoList'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ROUTER } from '@/routes/routerConstant'
import { Fragment, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const VideoList = () => {
  const [sortCase, setSortCase] = useState<string>('all')
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const navigate = useNavigate()

  const { videoList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteVideoList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  // 무한스크롤 적용
  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleSortCase = (key: string) => {
    setSortCase(key)
  }

  const handleVideoClick = (videoCaseId: number) => {
    navigate(`/${subcategoryId}${ROUTER.VIDEO}/${videoCaseId}`)
  }

  return (
    <div className={styles['video-list']}>
      <ArticleHeader
        title={`변호사의 영상을 보고\n내 법률 문제의 해결방법을 찾으세요`}
        onClick={handleSortCase}
        activeKey={sortCase}
        totalBlogCount={2147}
        recentBlogCount={4142}
      />
      {!isMobile && <Divider padding={24} />}
      <section className={styles['video-list-section']}>
        {videoList.map((video, index) => (
          <Fragment key={video.videoCaseId}>
            <VideoHorizon
              thumbnailUrl={video.thumbnail}
              title={video.title}
              lawyerName={video.lawyerName}
              lawfirmName={video.lawfirmName}
              channelName={video.channelName}
              channelThumbnail={video.channelThumbnail}
              onClick={() => handleVideoClick(video.videoCaseId)}
            />
            {!isMobile && index !== videoList.length - 1 && <Divider padding={24} />}
          </Fragment>
        ))}

        {/* 로딩 인디케이터 */}
        {(isLoading || isFetchingNextPage) && (
          <div className={styles['loading-container']}>
            <div className={styles['loading-text']}>로딩 중...</div>
          </div>
        )}
      </section>
    </div>
  )
}

export default VideoList
