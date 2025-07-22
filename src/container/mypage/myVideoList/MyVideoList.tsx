import { useInfiniteVideoList } from '@/hooks/queries/useGetVideoList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './myVideoList.module.scss'
import VideoHorizon from '@/components/video/VideoHorizon'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const MyVideoList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { videoList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteVideoList({
    subcategoryId: 'all',
    take: 4,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetching: isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <div className={styles.myVideoList}>
      {videoList.map((video, idx) => (
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
            isShowLike={true}
          />
          {!isMobile && idx !== videoList.length - 1 && <Divider padding={24} />}
        </>
      ))}
    </div>
  )
}

export default MyVideoList
