import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import VideoList from '@/container/video/videoList/VideoList'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteVideoList } from '@/hooks/queries/useGetVideoList'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'

const VideoLayout = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [sortCase, setSortCase] = useState<string>('all')

  const { videoList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteVideoList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  const videoIds = useMemo(() => videoList.map(v => v.videoCaseId), [videoList])

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    videoCaseIds: videoIds,
  })

  const handleSortCase = (key: string) => setSortCase(key)
  const handleVideoItemClick = (videoId: number) => navigate(`/${subcategoryId}/video/${videoId}`)

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <AIBlogCarousel />
        <VideoList
          videoList={videoList}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          sortCase={sortCase}
          onChangeSort={handleSortCase}
          onClickItem={handleVideoItemClick}
        />
      </section>
      <aside className='aside'>
        <section>
          <AIRecommender />
        </section>
        <section>
          <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
        </section>
      </aside>
    </main>
  )
}

export default VideoLayout
