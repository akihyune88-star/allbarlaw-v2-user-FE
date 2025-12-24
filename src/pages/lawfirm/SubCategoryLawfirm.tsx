import LawfirmFilter from '@/container/lawfirm/lawfirmFilter/LawfirmFilter'
import LawfirmList from '@/container/lawfirm/LawfirmList'
import { useInfiniteLawfirmList } from '@/hooks/queries/useGetLawfirmList'
import { useParams } from 'react-router-dom'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useMemo, useState } from 'react'
import { SortType } from '@/types/sortTypes'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Modal, { modalStyles } from '@/components/modal/Modal'
import { contentsRecommenderStyles } from '@/components/aiRecommender/ContentsRecommender'

const SubcategoryLawfirmLayout = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filter, setFilter] = useState<{
    orderBy?: SortType
    recentDays: 'all' | '7' | '30'
  }>({
    orderBy: 'viewCount',
    recentDays: 'all',
  })

  const { lawfirmList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteLawfirmList({
    subcategoryId: Number(subcategoryId),
    take: 6,
    orderBy: filter.orderBy,
    recentDays: filter.recentDays,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const lawfirmIds = useMemo(() => lawfirmList.map(f => f.lawfirmId), [lawfirmList])

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    lawfirmIds,
  })

  return (
    <main className='sub-main-container'>
      <section className='contents-section'>
        <LawfirmList
          lawfirmList={lawfirmList}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          onFilterClick={() => setIsFilterModalOpen(true)}
        />
      </section>
      <aside className='aside' style={{ width: '250px', flexShrink: 0 }}>
        <LawfirmFilter filter={filter} setFilter={setFilter} />
        {recommendationLegalTerm && recommendationLegalTerm.length > 0 && (
          <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
        )}
      </aside>
      {isMobile && (
        <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
          <Modal.Body className={modalStyles.noPadding}>
            <LawfirmFilter filter={filter} setFilter={setFilter} className={contentsRecommenderStyles.noBorder} />
          </Modal.Body>
          <Modal.Footer className={modalStyles.filterFooter}>
            <button
              type='button'
              className={modalStyles.filterCancelButton}
              onClick={() => setIsFilterModalOpen(false)}
            >
              닫기
            </button>
            <button
              type='button'
              className={modalStyles.filterConfirmButton}
              onClick={() => setIsFilterModalOpen(false)}
            >
              {lawfirmList.length}개의 조건검색
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </main>
  )
}

export default SubcategoryLawfirmLayout
