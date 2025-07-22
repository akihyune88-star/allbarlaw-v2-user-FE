import { useInfiniteVideoList } from '@/hooks/queries/useGetVideoList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './myVideoList.module.scss'
import VideoHorizon from '@/components/video/VideoHorizon'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import RecommenderVideo from '@/components/aiRecommender/RecommenderVideo'

const MyVideoList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { videoList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteVideoList({
    subcategoryId: 'all',
    take: 10,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetching: isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <div className={styles.myVideoList}>
      {!isMobile ? (
        videoList.map((video, idx) => (
          <>
            <VideoHorizon
              key={video.videoCaseId}
              thumbnailUrl={video.thumbnail}
              title={video.title}
              lawyerName={video.lawyerName}
              lawfirmName={video.lawfirmName}
              channelName={video.channelName}
              summaryContents={video.summaryContent}
              className={styles.myVideoItem}
            />
            {!isMobile && idx !== videoList.length - 1 && <Divider padding={24} />}
          </>
        ))
      ) : (
        <div className={styles.myVideoListMobile}>
          {videoList.map(video => (
            <RecommenderVideo
              key={video.videoCaseId}
              videoUrl={video.thumbnail}
              isShowTitle={false}
              description={video.title}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyVideoList
