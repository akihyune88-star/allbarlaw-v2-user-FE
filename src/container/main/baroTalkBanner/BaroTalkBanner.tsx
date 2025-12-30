import { useNavigate } from 'react-router-dom'
import styles from './baro-talk-banner.module.scss'
import lawyerBasicProfile from '@/assets/imgs/lawyer-basic-profile.webp'
import { ROUTER } from '@/routes/routerConstant'

const BaroTalkBanner = () => {
  const navigate = useNavigate()

  const handleRequestBaroTalk = () => {
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  const handleChatHistory = () => {
    navigate(ROUTER.MYPAGE, {
      state: {
        tab: 'chatList',
      },
    })
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{`전문 변호사와\n채팅상담을 지금 바로 할 수 있습니다.`}</h3>
      <div className={styles['button-container']}>
        <button className={styles.history} onClick={handleChatHistory}>
          법률 지식인 상담 내역
        </button>
        <button className={styles.chat} onClick={handleRequestBaroTalk}>
          변호사에게 채팅 상담
        </button>
      </div>
      <figure className={styles['profile-image']}>
        <img src={lawyerBasicProfile} alt='바로톡 배너' />
      </figure>
    </div>
  )
}

export default BaroTalkBanner
