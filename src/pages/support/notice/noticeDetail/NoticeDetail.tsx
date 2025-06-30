import { useGetNoticeDetail } from '@/hooks/queries/useGetNoticeDetail'
import styles from './noticeDetail.module.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const NoticeDetail = () => {
  const navigate = useNavigate()
  const { noticeId } = useParams()
  const { noticeTypeName } = useLocation().state
  const { data: noticeDetail } = useGetNoticeDetail(Number(noticeId))

  const handleListButtonClick = () => {
    navigate(-1)
  }

  return (
    <>
      <section className={styles['notice-detail']}>
        <header className={styles['notice-detail-header']}>
          <span className={styles['detail-info']}>
            <strong>{noticeTypeName}</strong> {dayjs(noticeDetail?.noticeCreatedAt).format('YYYY-MM-DD')}
          </span>
          <h3 className={styles['notice-detail-title']}>{noticeDetail?.noticeTitle}</h3>
        </header>
        <main className={styles['notice-content']}>
          <p>{noticeDetail?.noticeContent}</p>
        </main>
      </section>
      <button className={styles['notice-list-button']} onClick={handleListButtonClick}>
        목록보기
      </button>
    </>
  )
}

export default NoticeDetail
