import Divider from '@/components/divider/Divider'
import styles from './lawyerProfile.module.scss'
import Tag from '@/components/tag/Tag'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'

type LawyerProfileProps = {
  discription: string
  lawyerLawfirm: string
  lawyerAdress: string
  tags: { id: number; name: string }[] | []
}

const LawyerProfile = ({ discription, lawyerLawfirm, lawyerAdress, tags }: LawyerProfileProps) => {
  return (
    <section className={styles['lawyer-profile']} aria-label='변호사 프로필'>
      <blockquote className={styles['description']}>{discription}</blockquote>
      <div className={styles['lawyer-banner']}>
        <LawyerHorizon
          name='이영희'
          lawfirm={lawyerLawfirm}
          profileImage='https://picsum.photos/200/300'
          socialLink={[{ type: 'naver', link: 'https://www.naver.com' }]}
          buttonComponent={
            <button type='button' aria-label='변호사 연락처 보기' className={styles['barotalk-button']}>
              바로톡
            </button>
          }
          className={styles['lawyer-banner-item']}
        />
      </div>
      <div className={styles['lawfirm-container']}>
        <article className={styles['lawfirm']}>
          <div className={styles['lawfirm__info']}>
            <h3 className={styles['lawfirm__name']}>{lawyerLawfirm}</h3>
            <address className={styles['lawfirm__address']}>{lawyerAdress}</address>
            <nav className={styles['lawfirm__buttons']} aria-label='연락처 및 위치 정보'>
              <button type='button' aria-label='변호사 연락처 보기'>
                연락처 보기
              </button>
              <button type='button' aria-label='사무소 위치 보기'>
                위치 보기
              </button>
            </nav>
          </div>
        </article>
        <Divider padding={14} />
        <nav className={styles['tags']} aria-label='전문 분야'>
          {tags.map(tag => (
            <Tag key={tag.id} tag={tag.name} className={styles['tags__item']} />
          ))}
        </nav>
      </div>
    </section>
  )
}

export default LawyerProfile
