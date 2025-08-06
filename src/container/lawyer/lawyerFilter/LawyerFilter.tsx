import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
// import FilterSection from '@/components/filterSection/FilterSection'
import styles from './lawyerFilter.module.scss'

const LawyerFilter = () => {
  const handleReset = () => {}
  return (
    <ContentsRecommender
      title='필터 검색'
      isRefresh={true}
      onRefresh={handleReset}
      contents={
        <div className={styles['lawfirm-filter']}>
          {/* <FilterSection
            title='정렬'
            filterList={LAWFIRM_SORT_FILTER_CASE}
            onClick={handleOrderByChange}
            activeValue={filter.orderBy}
          />
          <FilterSection
            title='신규 등록 로펌'
            filterList={LAWFIRM_PERIOD_FILTER_CASE}
            onClick={handleRecentDaysChange}
            activeValue={filter.recentDays}
          /> */}
        </div>
      }
    />
  )
}

export default LawyerFilter
