import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import styles from './lawyer-list.module.scss'
import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Button from '@/components/button/Button'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SortType } from '@/types/sortTypes'
import { Lawyer } from '@/types/lawyerTypes'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate, useParams } from 'react-router-dom'
import SvgIcon from '@/components/SvgIcon'
import { useLawyerCount } from '@/hooks/queries/useLawyer'

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
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sortCase,
  onChangeSort,
  onClickItem,
}: LawyerListProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

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

  const handleBaroTalk = (e: React.MouseEvent, lawyerId: number) => {
    e.stopPropagation() // 이벤트 버블링 방지
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  const { data: lawyerTotalCount } = useLawyerCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : 'all',
    recentDays: 'all',
  })

  const { data: lawyerRecentCount } = useLawyerCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : 'all',
    recentDays: 30,
  })

  return (
    <div className={styles.container}>
      <header className={styles['header-wrapper']}>
        <ArticleHeader
          title={`분야별 전문 변호사를 찾아보시고 상담하세요.
          채팅상담을 남겨 주시면 24시간내에 답변 드립니다.`}
          onClick={handleSortCase}
          activeKey={sortCase}
          totalBlogCount={lawyerTotalCount}
          recentBlogCount={lawyerRecentCount}
        />
      </header>
      <section className={styles['lawyer-list-wrapper']}>
        {lawyerList.length === 0 ? (
          <div className={styles['empty-state']}>
            <SvgIcon name='user' size={48} color='#e6e6e6' />
            <p>현재 등록된 변호사가 없습니다.</p>
            <p>다른 분야를 선택해보세요.</p>
          </div>
        ) : (
          lawyerList.map(lawyer => {
            return (
              <React.Fragment key={lawyer.lawyerId}>
                <LawyerHorizon
                  lawyerId={lawyer.lawyerId}
                  className={styles['lawyer-list-item']}
                  onClick={() => handleLawyerDetail(lawyer.lawyerId)}
                  tags={lawyer.tags}
                  isBaroTalk={true}
                  name={lawyer.lawyerName || '이름 없음'}
                  lawfirm={lawyer.lawfirmName || '소속 없음'}
                  profileImage={lawyer.lawyerProfileImage}
                  description={lawyer.lawyerDescription}
                  ad={true}
                  buttonComponent={
                    isMobile && (
                      <div className={styles['button-wrapper']}>
                        <Button
                          onClick={e => {
                            e.stopPropagation()
                            handleLawyerDetail(lawyer.lawyerId)
                          }}
                        >
                          변호사페이지
                        </Button>
                        <Button variant='fill' onClick={e => handleBaroTalk(e, lawyer.lawyerId)}>
                          채팅상담
                        </Button>
                      </div>
                    )
                  }
                  size='small'
                />
              </React.Fragment>
            )
          })
        )}
      </section>
    </div>
  )
}

export default LawyerList
