import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Divider from '@/components/divider/Divider'
import VideoHorizon from '@/components/video/VideoHorizon'
import styles from './video-list.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Fragment } from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { VideoCase } from '@/types/videoTypes'

interface VideoListProps {
  videoList: VideoCase[]
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  sortCase: string
  onChangeSort: (key: string) => void
  onClickItem: (videoId: number) => void
}

const VideoList = ({
  videoList,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sortCase,
  onChangeSort,
  onClickItem,
}: VideoListProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  // 무한스크롤 적용
  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleSortCase = (key: string) => {
    onChangeSort(key)
  }

  const handleVideoClick = (videoCaseId: number) => {
    onClickItem(videoCaseId)
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
              videoCaseId={video.videoCaseId}
              isKeep={video.isKeep}
              lawyerName={video.lawyerName}
              lawfirmName={video.lawfirmName}
              channelName={video.channelName}
              channelThumbnail={video.channelThumbnail}
              summaryContents={video.summaryContent}
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
