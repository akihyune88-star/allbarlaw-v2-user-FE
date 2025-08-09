import VideoHorizon from '@/components/video/VideoHorizon'
import styles from './searchVideoResult.module.scss'
import { VideoCase } from '@/types/videoTypes'
import Divider from '@/components/divider/Divider'

type SearchVideoResultProps = {
  searchResults: VideoCase[]
  isLoading?: boolean
}

const SearchVideoResult = ({ searchResults, isLoading }: SearchVideoResultProps) => {
  if (isLoading) {
    return (
      <div className={styles['search-video-result']}>
        <div className={styles['loading']}>검색 중...</div>
      </div>
    )
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className={styles['search-video-result']}>
        <div className={styles['no-results']}>검색 결과가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles['search-video-result']}>
      {searchResults.map((video, index) => (
        <>
          <VideoHorizon
            key={video.videoCaseId}
            title={video.title}
            thumbnailUrl={video.thumbnail}
            summaryContents={video.summaryContent}
            isKeep={video.isKeep}
          />
          {index !== searchResults.length - 1 && <Divider padding={24} />}
        </>
      ))}
    </div>
  )
}

export default SearchVideoResult
