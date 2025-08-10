import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import SvgIcon from '@/components/SvgIcon'
import { SOCIAL_LINK_LIST } from '@/constants/lawyer'
import { LOCAL } from '@/constants/local'
import styles from '@/container/subMain/total/total-lawyer.module.scss'
import { useRandomLawyerList } from '@/hooks/queries/useLawyer'
// import { useLawyerList } from '@/hooks/queries/useLawyer'
import { useCategoryInfo } from '@/hooks/useCategoryInfo'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ROUTER } from '@/routes/routerConstant'
import { Lawyer } from '@/types/lawyerTypes'
import { useNavigate, useParams } from 'react-router-dom'

const TotalLawyer = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const categoryInfo = useCategoryInfo(subcategoryId)

  const { lawyerList } = useRandomLawyerList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : 'all',
    take: isMobile ? 3 : 4,
  })

  const handleTotalLawyerClick = () => navigate(`/${subcategoryId}${ROUTER.LAWYER}`)

  const handleLawyerClick = (lawyer: Lawyer) => {
    navigate(`/search/lawyer/${lawyer.lawyerId}`)
  }

  const handleBaroTalk = (lawyerId: number) => {
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <h2 className={styles['header-title']}>{categoryInfo?.subcategory.subcategoryName} 분야 전문 변호사</h2>
        <div className={styles['header-description']}>
          <span>전체 753명의 전문 변호사가 함께 합니다. </span>
          <button className='total-view-button' onClick={handleTotalLawyerClick}>
            <span>전체보기</span>
            <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(135deg)' }} />
          </button>
        </div>
      </header>
      <section className={styles['lawyer-list']}>
        {lawyerList.map(lawyer =>
          isMobile ? (
            <LawyerHorizon
              className={styles['lawyer-horizon']}
              key={lawyer.lawyerId}
              lawyerId={lawyer.lawyerId}
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
                  <button
                    className={`${styles['footer-button']} ${styles['left']}`}
                    onClick={() => handleBaroTalk(lawyer.lawyerId)}
                  >
                    바로톡
                  </button>
                </div>
              }
            />
          ) : (
            <LawyerVertical
              key={lawyer.lawyerId}
              lawyerId={lawyer.lawyerId}
              name={lawyer.lawyerName}
              profileImage={lawyer.lawyerProfileImage}
              type={1}
              blogUrl={lawyer.lawyerBlogUrl}
              youtubeUrl={lawyer.lawyerYoutubeUrl}
              instagramUrl={lawyer.lawyerInstagramUrl}
              socialLink={SOCIAL_LINK_LIST}
              tags={lawyer.tags}
              footer={
                <div className={styles['footer']}>
                  <button
                    className={`${styles['footer-button']} ${styles['left']}`}
                    onClick={() => handleLawyerClick(lawyer)}
                  >
                    더보기
                  </button>
                  <button
                    className={`${styles['footer-button']} ${styles['right']}`}
                    onClick={() => handleBaroTalk(lawyer.lawyerId)}
                  >
                    바로톡
                  </button>
                </div>
              }
            />
          )
        )}
      </section>
    </div>
  )
}

export default TotalLawyer
