import styles from './review.module.scss'

const reviewList = [
  {
    id: 1,
    content:
      '콘텐츠를 꾸준히 올렸더니 자연스럽게 상담 문의가 늘었습니다.\n바로톡으로 빠르게 응대할 수 있어 수임 전환율도 높아졌어요.',
    lawyerName: '김정민',
  },
  {
    id: 2,
    content:
      '다른 광고 플랫폼과 달리 노력한 만큼 성과가 나오는 구조가 마음에 듭니다.\n성실히 활동하니 의뢰인들이 먼저 찾아오더라고요.',
    lawyerName: '이수진',
  },
  {
    id: 3,
    content:
      '제 전문 분야 글을 올리면서 브랜딩도 하고 수임도 연결되니 일석이조입니다.\n올바로 덕분에 안정적으로 사건을 수임하고 있어요.',
    lawyerName: '박준호',
  },
  {
    id: 4,
    content:
      '채팅 상담이 부담스러웠는데 막상 해보니 의뢰인과 더 편하게 소통할 수 있었습니다.\n올바로 시작하고 업무량이 확실히 늘었네요.',
    lawyerName: '최윤아',
  },
]

const Review = () => {
  return (
    <main className={styles['review-wrapper']}>
      <header className={styles['review-title']}>
        <span className={styles['review-title-text']}>REVIEW</span>
        <h2>변호사 올바로 이용후기</h2>
        <h2>
          변호사 올바로
          <br /> 이용후기
        </h2>
      </header>
      <section className={styles['review-content']}>
        {reviewList.map(item => (
          <article key={item.id} className={styles['review-card']}>
            <div className={styles['review-card-content']}>
              <p className={styles['review-card-text']}>{item.content}</p>
              <p className={styles['review-card-lawyer']}>변호사 {item.lawyerName}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Review
