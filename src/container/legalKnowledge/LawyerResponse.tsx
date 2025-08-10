import Card from '@/components/card'
import styles from './lawyer-response.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import Divider from '@/components/divider/Divider'
import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'

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
  const [_isReportModalOpen, setIsReportModalOpen] = useState(false)
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleReportModalOpen = () => {
    setIsReportModalOpen(true)
  }

  const handleBaroTalk = (lawyerId: number) => {
    sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  return (
    <section className={styles['lawyer-response']}>
      {lawyers.map(lawyer => (
        <Card key={lawyer.lawyerId} shadow={false} border={false} className={styles['lawyer-response-card']}>
          <Card.Header className={styles['card-header']}>
            <figure>
              <img src={lawyer.lawyerProfileImage} alt={lawyer.lawyerName} />
            </figure>
            <div className={styles['card-header-info']}>
              <div className={styles['info-header']}>
                {!isMobile ? (
                  <>
                    <h4 className={styles['lawyer-name']}>{lawyer.lawyerName}</h4>
                    <p className={styles['lawfirm-name']}>{lawyer.lawfirmName}</p>
                    <div className={styles['selected-badge']}>
                      <span>의뢰인 선택</span>
                      <SvgIcon name='checkRound' stroke={COLOR.icon_darkgreen} fill={COLOR.white} size={10} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles['selected-badge']}>
                      <span>의뢰인 선택</span>
                      <SvgIcon name='checkRound' stroke={COLOR.icon_darkgreen} fill={COLOR.white} size={10} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <h4 className={styles['lawyer-name']}>{lawyer.lawyerName}</h4>
                      <p className={styles['lawfirm-name']}>{lawyer.lawfirmName}</p>
                    </div>
                  </>
                )}
              </div>
              <p className={styles['info-description']}>{lawyer.lawyerDescription}</p>
              {!isMobile && (
                <button className={styles['barotalk-btn']} onClick={() => handleBaroTalk(lawyer.lawyerId)}>
                  바로톡
                </button>
              )}
            </div>
          </Card.Header>
          {isMobile && (
            <button className={styles['mobile-barotalk-btn']} onClick={() => handleBaroTalk(lawyer.lawyerId)}>
              바로톡
            </button>
          )}
          <Divider />
          <Card.Content>
            <p className={styles['description']}>{lawyer.content}</p>
          </Card.Content>
          <Card.Footer className={styles.footer}>
            <span className={styles['answer-date']}>
              <strong>3시간전</strong>
              <span>답변</span>
            </span>
            <button className={styles.button} style={{ alignItems: 'flex-end' }} onClick={handleReportModalOpen}>
              <SvgIcon name='error' size={16} />
              신고하기
            </button>
          </Card.Footer>
        </Card>
      ))}
    </section>
  )
}

export default LawyerResponse
