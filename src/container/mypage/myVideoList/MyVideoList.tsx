import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './myVideoList.module.scss'
import VideoHorizon from '@/components/video/VideoHorizon'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import RecommenderVideo from '@/components/aiRecommender/RecommenderVideo'
import { useInfiniteMyVideoList } from '@/hooks/queries/useMypage'
import { useNavigate } from 'react-router-dom'
import { VideoCase } from '@/types/videoTypes'

const MyVideoList = ({ sort }: { sort: 'asc' | 'desc' }) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { videoList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteMyVideoList({
    take: 10,
    sort: sort,
  })

  console.log(videoList)

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleVidoeDetail = (video: VideoCase) => {
    navigate(`/${video.subcategoryId}/video/${video.videoCaseId}`)
  }

  return (
    <div className={styles.myVideoList}>
      {!isMobile ? (
        videoList.map((video, idx) => (
          <>
            <VideoHorizon
              key={video.videoCaseId}
              videoCaseId={video.videoCaseId}
              thumbnailUrl={video.thumbnail}
              title={video.title}
              isKeep={video.isKeep}
              lawyerName={video.lawyerName}
              lawfirmName={video.lawfirmName}
              channelName={video.channelName}
              summaryContents={video.summaryContent}
              className={styles.myVideoItem}
              onClick={() => handleVidoeDetail(video)}
            />
            {!isMobile && idx !== videoList.length - 1 && <Divider padding={24} />}
          </>
        ))
      ) : (
        <div className={styles.myVideoListMobile}>
          {videoList.map(video => (
            <RecommenderVideo
              isVideoKeep={video.isKeep}
              key={video.videoCaseId}
              videoUrl={video.thumbnail}
              isShowTitle={false}
              description={video.title}
              onClick={() => handleVidoeDetail(video)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyVideoList
