import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import styles from '@/container/subMain/total/total-video.module.scss'
import { useGetVideoCount } from '@/hooks/queries/useGetVideoCount'
import { useGetVideoList } from '@/hooks/queries/useGetVideoList'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate, useParams } from 'react-router-dom'

const TotalVideo = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const navigate = useNavigate()

  const { videoList } = useGetVideoList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
  })

  const { data: totalVideoCount } = useGetVideoCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    recentDays: 'all',
  })

  const { data: recentMonthVideoCount } = useGetVideoCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    recentDays: 30,
  })

  const handleTotalVideoClick = () => navigate(`/${subcategoryId}${ROUTER.VIDEO}`)

  const handleVideoClick = (videoCaseId: number) => {
    navigate(`/${subcategoryId}${ROUTER.VIDEO}/${videoCaseId}`)
  }

  return (
    <div className={styles['container']}>
      <ArticleHeader
        title='법률 영상'
        totalBlogCount={totalVideoCount}
        recentBlogCount={recentMonthVideoCount}
        type='total'
        titleType='horizontal'
        onClickTotalView={handleTotalVideoClick}
      />
      <div className={styles['video-list']}>
        {videoList.map(video => (
          <VideoThumbnail
            key={video.videoCaseId}
            size={isMobile ? 'large' : 'small'}
            imgUrl={video.thumbnail}
            onClick={() => handleVideoClick(video.videoCaseId)}
            title={video.title}
          />
        ))}
      </div>
    </div>
  )
}

export default TotalVideo
