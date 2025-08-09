import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import styles from './lawyer-list.module.scss'
import React from 'react'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Button from '@/components/button/Button'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SortType } from '@/types/sortTypes'
import { Lawyer } from '@/types/lawyerTypes'

interface LawyerListProps {
  lawyerList: Lawyer[]
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  sortCase: SortType
  onChangeSort: (_key: SortType) => void
  onClickItem: (_lawyerId: number) => void
}

const LawyerList = ({
  lawyerList,
  isLoading: _isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sortCase,
  onChangeSort,
  onClickItem,
}: LawyerListProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleSortCase = (key: SortType) => {
    onChangeSort(key)
  }

  const handleLawyerDetail = (lawyerId: number) => {
    onClickItem(lawyerId)
  }

  return (
    <div className={styles.container}>
      <header className={styles['header-wrapper']}>
        <ArticleHeader
          title={`분야별 전문 변호사를 찾아보시고 상담하세요.
          채팅상담을 남겨 주시면 24시간내에 답변 드립니다.`}
          onClick={handleSortCase}
          activeKey={sortCase}
          totalBlogCount={2147}
          recentBlogCount={4142}
        />
      </header>
      <section className={styles['lawyer-list-wrapper']}>
        {lawyerList.map((lawyer, index) => {
          const isLastItem = index === lawyerList.length - 1 && !hasNextPage

          return (
            <React.Fragment key={lawyer.lawyerId}>
              <LawyerHorizon
                onClick={() => handleLawyerDetail(lawyer.lawyerId)}
                tags={lawyer.tags}
                isBaroTalk={true}
                className={styles['lawyer-list-item']}
                name={lawyer.lawyerName}
                lawfirm={lawyer.lawfirmName}
                profileImage={lawyer.lawyerProfileImage}
                description={lawyer.lawyerDescription}
                ad={true}
                buttonComponent={
                  isMobile && (
                    <div className={styles['button-wrapper']}>
                      <Button>변호사페이지</Button>
                      <Button variant='fill'>채팅상담</Button>
                    </div>
                  )
                }
                size='small'
              />
              {!isLastItem && <Divider padding={16} />}
            </React.Fragment>
          )
        })}
      </section>
    </div>
  )
}

export default LawyerList
