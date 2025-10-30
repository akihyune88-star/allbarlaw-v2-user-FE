import RecommenderVideo from '@/components/aiRecommender/RecommenderVideo'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'
import styles from './lawyer-video-spotlight.module.scss'

interface MobileVidoeSpotlightProps {
  excludeIds: number[]
  handleVideoClick: (_subcategoryId: number, _videoId: number) => void
}

const MobileVidoeSpotlight = ({ excludeIds, handleVideoClick }: MobileVidoeSpotlightProps) => {
  const { videoList } = useRandomVideoList({
    subcategoryId: 'all',
    take: 5,
    excludeIds: excludeIds,
    // enabled: excludeIds.length > 0,
  })

  return (
    <div className={styles['mobile-video-spotlight']}>
      {videoList?.map(video => (
        <div key={video.videoCaseId}>
          <RecommenderVideo
            key={video.videoCaseId}
            videoUrl={video.thumbnail}
            title={video.title}
            showBookmarkButton={false}
            lawyerName={video.lawyerName}
            lawfirmName={video.lawfirmName}
            onClick={() => handleVideoClick(video.subcategoryId, video.videoCaseId)}
          />
        </div>
      ))}
    </div>
  )
}

export default MobileVidoeSpotlight
