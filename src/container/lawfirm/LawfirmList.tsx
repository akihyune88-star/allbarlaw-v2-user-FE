import styles from '@/container/lawfirm/lawfirm-list.module.scss'
import LawfirmHorizon from '@/components/lawfirm/LawfirmHorizon'
import MultipleImageSlider from '@/components/multipleImageSlider/MultipleImageSlider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useInfiniteLawfirmList } from '@/hooks/queries/useGetLawfirmList'
import { useParams } from 'react-router-dom'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const LawfirmList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const { lawfirmList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteLawfirmList({
    subcategoryId: Number(subcategoryId),
    take: 4,
  })

  // 무한스크롤 적용
  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetching: isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <main className={styles['lawfirm-container']}>
      <section className={styles['lawfirm-list']} aria-label='로펌 목록'>
        {lawfirmList.map((lawfirm, idx) => {
          const imageList = lawfirm.lawfirmImages.map(image => image.lawfirmImageUrl)
          const hasImages = imageList && imageList.length > 0
          console.log(imageList.length)
          return (
            <div key={idx} className={`${styles['lawfirm-item']} ${hasImages ? styles['has-images'] : ''}`}>
              <LawfirmHorizon
                className={styles['content-wrapper']}
                lawfirmThumbnail={lawfirm.lawfirmLogoImageUrl}
                blogUrl={lawfirm.lawfirmBlogUrl}
                lawfirmName={lawfirm.lawfirmName}
                title={lawfirm.lawfirmGreetingTitle}
                description={lawfirm.lawfirmGreetingContent}
                address={lawfirm.lawfirmAddress}
                phoneNumber={lawfirm.lawfirmContact}
                homepageUrl={lawfirm.lawfirmHomepageUrl}
                linkList={[
                  { label: '변호사소개', url: 'https://example.com' },
                  { label: '유튜브', url: 'https://example.com' },
                  { label: '블로그', url: 'https://example.com' },
                  { label: '의뢰인후기', url: 'https://example.com' },
                ]}
              />
              {hasImages && <MultipleImageSlider imageList={imageList} width={isMobile ? 335 : 796} />}
            </div>
          )
        })}

        {/* 로딩 인디케이터 */}
        {(isLoading || isFetchingNextPage) && (
          <div className={styles['loading-container']}>
            <div className={styles['loading-text']}>로딩 중...</div>
          </div>
        )}
      </section>
    </main>
  )
}

export default LawfirmList
