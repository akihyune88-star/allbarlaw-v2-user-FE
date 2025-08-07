import Divider from '@/components/divider/Divider'
import styles from './lawyerProfile.module.scss'
import Tag from '@/components/tag/Tag'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import Modal from '@/components/modal'
import { useState } from 'react'

type LawyerProfileProps = {
  discription: string
  lawyerLawfirm: string
  lawyerAdress: string
  lawyerId: number
  lawyerName: string
  lawfirmContact: string
  tags: { id: number; name: string }[] | []
}

const LawyerProfile = ({
  discription,
  lawyerLawfirm,
  lawyerAdress,
  lawyerId,
  lawyerName,
  lawfirmContact,
  tags,
}: LawyerProfileProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const handleBaroTalk = () => {
    console.log('baroTalk', lawyerId)
  }

  const handleOpenModal = (message: string) => {
    setModalMessage(message)
    setIsOpen(true)
  }

  return (
    <>
      <section className={styles['lawyer-profile']} aria-label='변호사 프로필'>
        <blockquote className={styles['description']}>{discription}</blockquote>
        <div className={styles['lawyer-banner']}>
          <LawyerHorizon
            name={lawyerName}
            lawfirm={lawyerLawfirm}
            profileImage='https://picsum.photos/200/300'
            socialLink={[{ type: 'naver', link: 'https://www.naver.com' }]}
            buttonComponent={
              <button
                type='button'
                aria-label='바로톡 채팅상담요청'
                className={styles['barotalk-button']}
                onClick={handleBaroTalk}
              >
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
                <button type='button' aria-label='변호사 연락처 보기' onClick={() => handleOpenModal(lawfirmContact)}>
                  연락처 보기
                </button>
                <button type='button' aria-label='사무소 위치 보기' onClick={() => handleOpenModal(lawyerAdress)}>
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>{modalMessage}</p>
        <button>닫기</button>
      </Modal>
    </>
  )
}

export default LawyerProfile
