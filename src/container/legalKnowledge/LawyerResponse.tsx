import Card from '@/components/card'
import styles from './lawyer-response.module.scss'

type LawyerResponseProps = {
  lawyers: {
    lawyerId: number
    lawyerName: string
    lawfirmName: string
    lawyerDescription: string
    lawyerProfileImage: string
    content: string
  }[]
}

const LawyerResponse = ({ lawyers }: LawyerResponseProps) => {
  return (
    <section className={styles['lawyer-response']}>
      {lawyers.map(lawyer => (
        <Card key={lawyer.lawyerId} shadow={false} border={false} className={styles['lawyer-response-card']}>
          <Card.Header className={styles['lawyer-response-card-header']}>
            <figure>
              <img src={lawyer.lawyerProfileImage} alt={lawyer.lawyerName} />
            </figure>
            <div>
              <div className={styles['lawyer-response-card-header-info']}>
                <h4>{lawyer.lawyerName}</h4>
                <p>{lawyer.lawfirmName}</p>
              </div>
            </div>
          </Card.Header>
        </Card>
      ))}
    </section>
  )
}

export default LawyerResponse
