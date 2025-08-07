import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
import SvgIcon from '@/components/SvgIcon'
import { SOCIAL_LINK_LIST } from '@/constants/lawyer'
import styles from '@/container/subMain/total/total-lawyer.module.scss'
// import { useLawyerList } from '@/hooks/queries/useLawyer'
import { useCategoryInfo } from '@/hooks/useCategoryInfo'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useParams } from 'react-router-dom'

const TotalLawyer = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const mapItem = [1, 2, 3, 4]
  // const { data } = useLawyerList({
  //   take: 4,
  //   subcategoryId: 'all',
  //   achievementId: 'all',
  //   orderBy: 'createdAt',
  // })

  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const categoryInfo = useCategoryInfo(subcategoryId)

  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <h2 className={styles['header-title']}>{categoryInfo?.subcategory.subcategoryName} 분야 전문 변호사</h2>
        <div className={styles['header-description']}>
          <span>전체 753명의 전문 변호사가 함께 합니다. </span>
          <button className='total-view-button'>
            <span>전체보기</span>
            <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>
      </header>
      <section className={styles['lawyer-list']}>
        {mapItem.map(item =>
          isMobile ? (
            <LawyerHorizon
              className={styles['lawyer-horizon']}
              key={item}
              name='김철수'
              lawfirm='법무법인 대한법률사무소'
              socialLink={SOCIAL_LINK_LIST}
              profileImage='https://picsum.photos/200/300'
              // tags={['재산범죄', '사기', '지식재산권', '형사기타', '이면계약중지', '이면계약중지']}
              buttonComponent={
                <div className={styles['footer']}>
                  <button className={`${styles['footer-button']} ${styles['left']}`}>더보기</button>
                  <button className={`${styles['footer-button']} ${styles['left']}`}>바로톡</button>
                </div>
              }
            />
          ) : (
            <LawyerVertical
              key={item}
              name='김철수'
              profileImage='https://picsum.photos/200/300'
              type={1}
              socialLink={SOCIAL_LINK_LIST}
              // tags={['재산범죄', '사기', '지식재산권', '형사기타', '이면계약중지', '이면계약중지']}
              footer={
                <div className={styles['footer']}>
                  <button className={`${styles['footer-button']} ${styles['left']}`}>더보기</button>
                  <button className={`${styles['footer-button']} ${styles['right']}`}>바로톡</button>
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
