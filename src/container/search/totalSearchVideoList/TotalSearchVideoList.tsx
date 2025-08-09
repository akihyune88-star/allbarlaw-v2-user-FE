import { VideoCase } from '@/types/videoTypes'
import SearchSectionHeader from '../searchSectionHeader/SearchSectionHeader'
import styles from './totalSearchVideoList.module.scss'
import VideoHorizon from '@/components/video/VideoHorizon'
import { useNavigate } from 'react-router-dom'

interface TotalSearchVideoListProps {
  searchResults: VideoCase[]
  query: string
}

const TotalSearchVideoList = ({ searchResults, query: _query }: TotalSearchVideoListProps) => {
  const navigate = useNavigate()

  const handleClickMore = () => {
    navigate('/search/video')
  }

  const handleClickVideoDetail = (videoCaseId: number) => {
    navigate(`/search/video/${videoCaseId}`)
  }

  return (
    <div className={styles['total-search-video-list']}>
      <SearchSectionHeader title='법률 영상' onClickMore={handleClickMore} />
      <div className={styles['video-list']}>
        {searchResults.map(video => (
          <div key={video.videoCaseId}>
            <VideoHorizon
              videoCaseId={video.videoCaseId}
              isKeep={video.isKeep}
              size='small'
              thumbnailUrl={video.thumbnail}
              title={video.title}
              summaryContents={video.summaryContent}
              onClick={() => handleClickVideoDetail(video.videoCaseId)}
            />
            <footer className={styles['video-item-footer']}>
              <span className={styles['lawyer-info']}>
                {video.lawyerName} 변호사 [{video.lawfirmName}]
              </span>
              <div className={styles['channel-info']}>
                <figure>
                  <img src={video.thumbnail} alt={video.channelName} />
                </figure>
                <span className={styles['channel-name']}>{video.channelName}</span>
              </div>
            </footer>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TotalSearchVideoList
