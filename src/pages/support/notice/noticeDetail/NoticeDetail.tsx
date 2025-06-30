import styles from './noticeDetail.module.scss'
import { useNavigate } from 'react-router-dom'

const NoticeDetail = () => {
  const navigate = useNavigate()

  const handleListButtonClick = () => {
    navigate(-1)
  }

  return (
    <>
      <section className={styles['notice-detail']}>
        <header className={styles['notice-detail-header']}>
          <span className={styles['detail-info']}>
            <strong>공지</strong> 2025-01-03
          </span>
          <h3 className={styles['notice-detail-title']}>공지사항 제목</h3>
        </header>
        <main className={styles['notice-content']}>
          <p>{content}</p>
        </main>
      </section>
      <button className={styles['notice-list-button']} onClick={handleListButtonClick}>
        목록보기
      </button>
    </>
  )
}

export default NoticeDetail

const content = `음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가 음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가...

음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가...

음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가...음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.

음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가...`
