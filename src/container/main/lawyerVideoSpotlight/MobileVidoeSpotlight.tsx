import VideoHorizon from '@/components/video/VideoHorizon'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'

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
    <div>
      {videoList?.map(video => (
        <div key={video.videoCaseId}>
          <VideoHorizon
            videoCaseId={video.videoCaseId}
            isKeep={video.isKeep}
            // size='re'
            thumbnailUrl={video.thumbnail}
            title={video.title}
            summaryContents={video.summaryContent}
            onClick={() => handleVideoClick(video.subcategoryId, video.videoCaseId)}
          />
        </div>
      ))}
    </div>
  )
}

export default MobileVidoeSpotlight
