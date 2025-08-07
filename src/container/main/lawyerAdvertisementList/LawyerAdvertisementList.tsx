import PlayButton from '@/components/playButton/PlayButton'
import styles from './lawyer-advertisement-list.module.scss'
import { COLOR } from '@/styles/color'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SOCIAL_LINK_LIST } from '@/constants/lawyer'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import { useRandomLawyerList } from '@/hooks/queries/useLawyer'
import { useNavigationHistory } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { Lawyer } from '@/types/lawyerTypes'
import SvgIcon from '@/components/SvgIcon'

const LawyerAdvertisementListHeader = ({
  onNext,
  onPrev,
  refetch,
}: {
  onNext?: () => void
  onPrev?: () => void
  refetch?: () => void
}) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  return (
    <header className={styles['lawyer-advertisement-list-header']}>
      <div className={styles['text-wrapper']}>
        <h4 className={styles['title']}>함께 시작하는 전문 변호사</h4>
        <span className={styles['sub-title']}>전체 753명의 전문 변호사가 함께 합니다.</span>
      </div>
      {!isMobile ? (
        <PlayButton iconColor={COLOR.text_black} onNext={onNext} onPrev={onPrev} />
      ) : (
        <SvgIcon name='refresh' size={16} onClick={refetch} style={{ cursor: 'pointer' }} />
      )}
    </header>
  )
}

const LawyerAdvertisementList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev } = useNavigationHistory()

  const { lawyerList, hasNextPage, refetch } = useRandomLawyerList({
    subcategoryId: 'all',
    take: isMobile ? 3 : 4,
    excludeIds: currentExcludeIds,
  })

  const handleClickNext = () => {
    if (lawyerList && lawyerList.length > 0) {
      const currentIds = lawyerList.map(lawyer => lawyer.lawyerId)
      handleNext(currentIds)
    }
  }

  const handleLawyerClick = (lawyer: Lawyer) => {
    // 검색 페이지로 이동
    console.log(lawyer)
  }

  return (
    <section className={styles['container']}>
      <LawyerAdvertisementListHeader
        onNext={hasNextPage ? handleClickNext : undefined}
        onPrev={canGoPrev ? handlePrev : undefined}
        refetch={refetch}
      />

      <div className={styles['lawyer-list']}>
        {lawyerList.map(lawyer =>
          isMobile ? (
            <LawyerHorizon
              className={styles['lawyer-horizon']}
              key={lawyer.lawyerId}
              name={lawyer.lawyerName}
              lawfirm={lawyer.lawfirmName}
              socialLink={SOCIAL_LINK_LIST}
              profileImage={lawyer.lawyerProfileImage}
              tags={lawyer.tags}
              buttonComponent={
                <div className={styles['footer']}>
                  <button
                    className={`${styles['footer-button']} ${styles['left']}`}
                    onClick={() => handleLawyerClick(lawyer)}
                  >
                    더보기
                  </button>
                  <button className={`${styles['footer-button']} ${styles['left']}`}>바로톡</button>
                </div>
              }
            />
          ) : (
            <LawyerVertical
              lawyerId={lawyer.lawyerId}
              key={lawyer.lawyerId}
              className={styles['custom-lawyer-vertical']}
              name={lawyer.lawyerName}
              profileImage={lawyer.lawyerProfileImage}
              type={1}
              blogUrl={lawyer.lawyerBlogUrl}
              youtubeUrl={lawyer.lawyerYoutubeUrl}
              instagramUrl={lawyer.lawyerInstagramUrl}
              tags={lawyer.tags}
              footer={
                <div className={styles['footer']}>
                  <button
                    className={`${styles['footer-button']} ${styles['left']}`}
                    onClick={() => handleLawyerClick(lawyer)}
                  >
                    더보기
                  </button>
                  <button className={`${styles['footer-button']} ${styles['right']}`}>바로톡</button>
                </div>
              }
            />
          )
        )}
      </div>
    </section>
  )
}

export default LawyerAdvertisementList
