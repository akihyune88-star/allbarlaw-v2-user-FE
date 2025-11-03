import styles from './review.module.scss'

const reviewList = [
  {
    id: 1,
    content:
      '올바로는 단순 노출이 아니라 ‘신뢰’를 쌓아주는 플랫폼이었습니다.\n제 글을 보고 의뢰인들이 먼저 믿고 상담을 요청하더군요.',
    lawyerName: '서울 법무법인L, 이OO 변호사',
  },
  {
    id: 2,
    content:
      '바빠서 마케팅에 신경 쓸 여유가 없었는데,\n올바로는 제가 평소 하던 일만으로 자연스럽게 브랜딩이 되었습니다.',
    lawyerName: '부산 법무법인S, 진OO 변호사',
  },
  {
    id: 3,
    content:
      '경쟁이 아닌 성장의 동기를 주는 플랫폼이었습니다.\n활동할수록 제 이름이 쌓이고, 그게 상담으로 이어졌습니다.',
    lawyerName: '대전 법무법인H, 이OO 변호사',
  },
  {
    id: 4,
    content:
      '올바로는 광고 느낌이 없어서 좋았습니다.\n자연스럽게 신뢰가 쌓여서 억지스러운 홍보 없이도 상담이 이어졌습니다.',
    lawyerName: '서울 법률사무소H, 김OO 변호사',
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
