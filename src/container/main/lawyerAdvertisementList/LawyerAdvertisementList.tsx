import PlayButton from '@/components/playButton/PlayButton'
import styles from './lawyer-advertisement-list.module.scss'
import { COLOR } from '@/styles/color'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SOCIAL_LINK_LIST } from '@/constants/lawyer'
import LawyerVertical from '@/components/lawyer/LawyerVertical'
// import { useLawyerList } from '@/hooks/queries/useLawyer'

const LawyerAdvertisementListHeader = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  return (
    <header className={styles['lawyer-advertisement-list-header']}>
      <div className={styles['text-wrapper']}>
        <h4 className={styles['title']}>함께 시작하는 전문 변호사</h4>
        <span className={styles['sub-title']}>전체 753명의 전문 변호사가 함께 합니다.</span>
      </div>
      {!isMobile && <PlayButton iconColor={COLOR.text_black} />}
    </header>
  )
}

const LawyerAdvertisementList = () => {
  const mapItem = [1, 2, 3, 4]
  const isMobile = useMediaQuery('(max-width: 80rem)')
  // const { data } = useLawyerList({
  //   subcategoryId: 'all',
  //   achievementId: 'all',
  //   orderBy: 'createdAt',
  // })

  return (
    <section className={styles['container']}>
      <LawyerAdvertisementListHeader />

      <div className={styles['lawyer-list']}>
        {mapItem.map(item =>
          isMobile ? (
            <LawyerHorizon
              className={styles['lawyer-horizon']}
              key={item}
              name='김철수'
              lawfirm='법무법인 대한법률사무소'
              socialLink={SOCIAL_LINK_LIST}
              profileImage='https://picsum.photos/200/300'
              // tags={['재산범죄', '사기', '지식재산권', '형사기타', '이면계약중지'] as Ta[]}
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
              className={styles['custom-lawyer-vertical']}
              name='김철수'
              profileImage='https://picsum.photos/200/300'
              type={1}
              socialLink={SOCIAL_LINK_LIST}
              // tags={['재산범죄', '사기', '지식재산권', '형사기타', '이면계약중지']}
              footer={
                <div className={styles['footer']}>
                  <button className={`${styles['footer-button']} ${styles['left']}`}>더보기</button>
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
