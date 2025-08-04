import Divider from '@/components/divider/Divider'
import styles from './lawyerProfile.module.scss'
import Tag from '@/components/tag/Tag'

type LawyerProfileProps = {
  discription: string
  lawyerLawfirm: string
  lawyerAdress: string
  tags: { id: number; name: string }[]
}

const LawyerProfile = ({ discription, lawyerLawfirm, lawyerAdress, tags }: LawyerProfileProps) => {
  return (
    <section className={styles['lawyer-profile']} aria-label='변호사 프로필'>
      <blockquote className={styles['discription']}>{discription}</blockquote>
      <div className={styles['lawyer-info']}>
        <article className={styles['lawyer-lawfirm']}>
          <div className={styles['lawyer-lawfirm-info']}>
            <h3 className={styles['lawyer-lawfirm-info-name']}>{lawyerLawfirm}</h3>
            <address className={styles['lawyer-lawfirm-info-adress']}>{lawyerAdress}</address>
            <nav className={styles['lawyer-lawfirm-button']} aria-label='연락처 및 위치 정보'>
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
            <Tag key={tag.id} tag={tag.name} className={styles['tag']} />
          ))}
        </nav>
      </div>
    </section>
  )
}

export default LawyerProfile
