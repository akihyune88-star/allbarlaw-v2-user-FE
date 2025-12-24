import LawyerList from '@/container/lawyer/LawyerList'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteLawyerList } from '@/hooks/queries/useLawyer'
import { SortType } from '@/types/sortTypes'
import LawyerFilter from '@/container/lawyer/lawyerFilter/LawyerFilter'
import { LawyerListFilter } from '@/types/lawyerTypes'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Modal, { modalStyles } from '@/components/modal/Modal'
import { contentsRecommenderStyles } from '@/components/aiRecommender/ContentsRecommender'

const LawyerLayout = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [sortCase, setSortCase] = useState<SortType>('createdAt')

  const [filter, setFilter] = useState<LawyerListFilter>({
    orderBy: 'careerDesc',
    gender: 'all',
    achievementId: 'all',
    region: 'all',
  })

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteLawyerList({
    subcategoryId: Number(subcategoryId),
    ...filter,
  })

  const lawyerList = data?.lawyerList || []

  const handleSortCase = (key: SortType) => setSortCase(key === 'all' ? 'createdAt' : key)
  const handleLawyerItemClick = (lawyerId: number) => navigate(`/${subcategoryId}/lawyer/${lawyerId}`)

  return (
    <main className='sub-main-container'>
      <section className='contents-section' style={{ width: 798 }}>
        <LawyerList
          lawyerList={lawyerList}
          isLoading={isLoading}
          hasNextPage={hasNextPage || false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          sortCase={sortCase}
          onChangeSort={handleSortCase}
          onClickItem={handleLawyerItemClick}
          onFilterClick={() => setIsFilterModalOpen(true)}
        />
      </section>
      <aside className='aside'>
        <LawyerFilter filter={filter} onFilterChange={setFilter} />
      </aside>
      {isMobile && (
        <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
          <Modal.Body className={modalStyles.noPadding}>
            <LawyerFilter filter={filter} onFilterChange={setFilter} className={contentsRecommenderStyles.noBorder} />
          </Modal.Body>
          <Modal.Footer className={modalStyles.filterFooter}>
            <button type='button' className={modalStyles.filterCancelButton} onClick={() => setIsFilterModalOpen(false)}>
              닫기
            </button>
            <button type='button' className={modalStyles.filterConfirmButton} onClick={() => setIsFilterModalOpen(false)}>
              {lawyerList.length}명의 조건검색
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </main>
  )
}

export default LawyerLayout
