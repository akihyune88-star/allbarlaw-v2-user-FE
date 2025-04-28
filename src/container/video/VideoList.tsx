import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Divider from '@/components/divider/Divider'
import VideoHorizon from '@/components/video/VideoHorizon'
import styles from '@/container/video/video-list.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useState } from 'react'

const VideoList = () => {
  const [sortCase, setSortCase] = useState<string>('all')
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const videoList = [1, 2, 3, 4, 5]

  const handleSortCase = (key: string) => {
    setSortCase(key)
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
          <>
            <VideoHorizon key={video} />
            {!isMobile && index !== videoList.length - 1 && <Divider padding={24} />}
          </>
        ))}
      </section>
    </div>
  )
}

export default VideoList
