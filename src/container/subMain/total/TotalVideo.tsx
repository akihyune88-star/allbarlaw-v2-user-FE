import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import styles from '@/container/subMain/total/total-video.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const TotalVideo = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const mapItem = [1, 2, 3, 4]
  return (
    <div className={styles['container']}>
      <ArticleHeader title='법률 영상' totalBlogCount={10} recentBlogCount={10} type='total' titleType='horizontal' />
      <div className={styles['video-list']}>
        {mapItem.map(item => (
          <VideoThumbnail
            key={item}
            size={isMobile ? 'large' : 'small'}
            imgUrl='https://dimg.donga.com/wps/NEWS/IMAGE/2023/05/24/119463126.1.jpg'
            title='변호사 비용 얼마일까? 형사사건에 변호사 선임 꼭 해야 하는 이유를 알려드립니다.'
          />
        ))}
      </div>
    </div>
  )
}

export default TotalVideo
