import { useNavigate, useParams } from 'react-router-dom'
import styles from './noticeListByCategory.module.scss'
import { ROUTER } from '@/routes/routerConstant'

const NoticeListByCategory = () => {
  const { categoryPath } = useParams()
  const navigate = useNavigate()
  console.log(categoryPath)

  const handleNoticeClick = (noticeId: number) => {
    navigate(`${ROUTER.NOTICE_DETAIL}/${noticeId}`)
  }

  return (
    <section className={styles['notice-list-container']}>
      {noticeList.map(notice => (
        <div key={notice.id} className={styles['notice-item']} onClick={() => handleNoticeClick(notice.id)}>
          <span className={styles['left-container']}>
            <strong>{getCategoryName(notice.category)}</strong>
            <span className={styles['title']}>{notice.title}</span>
          </span>
          <span className={styles['created-at']}>{notice.createdAt}</span>
        </div>
      ))}
      <div className={styles['pagination-container']}>
        <button className={styles['pagination-button']}>이전</button>
        <button className={styles['pagination-button']}>다음</button>
      </div>
    </section>
  )
}

export default NoticeListByCategory

const noticeList = [
  {
    id: 1,
    category: 'total',
    title:
      '제목을 1줄 이내로 보여줍니다. 제목을 1줄 이내로 보여줍니다. 제목을 1줄 이내로 보여줍니다.제목을 1줄 이내로 보여줍니다. 제목을 1줄 이내로 보여줍니다. 제목을 1줄 이내로 보여줍니다.',
    createdAt: '2021-01-01',
  },
  { id: 2, category: 'notice', title: '공지사항 2', createdAt: '2021-01-02' },
  { id: 3, category: 'update', title: '공지사항 3', createdAt: '2021-01-03' },
  { id: 4, category: 'event', title: '공지사항 4', createdAt: '2021-01-04' },
  { id: 5, category: 'total', title: '공지사항 5', createdAt: '2021-01-05' },
  { id: 6, category: 'notice', title: '공지사항 6', createdAt: '2021-01-06' },
  { id: 7, category: 'update', title: '공지사항 7', createdAt: '2021-01-07' },
  { id: 8, category: 'event', title: '공지사항 8', createdAt: '2021-01-08' },
  { id: 9, category: 'total', title: '공지사항 9', createdAt: '2021-01-09' },
  { id: 10, category: 'notice', title: '공지사항 10', createdAt: '2021-01-10' },
]

const getCategoryName = (category: string) => {
  switch (category) {
    case 'total':
      return '전체'
    case 'notice':
      return '공지사항'
    case 'update':
      return '업데이트'
    case 'event':
      return '이벤트'
  }
}
