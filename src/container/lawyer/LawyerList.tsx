import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import styles from './lawyer-list.module.scss'
import { useState } from 'react'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Button from '@/components/button/Button'

const LawyerList = () => {
  const [sortCase, setSortCase] = useState<string>('all')
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const lawyerList = [1, 2, 3, 4, 5]

  const handleSortCase = (key: string) => {
    setSortCase(key)
  }

  return (
    <div className={styles.container}>
      <header className={styles['header-wrapper']}>
        <ArticleHeader
          title={`분야별 전문 변호사를 찾아보시고 상담하세요.
          채팅상담을 남겨 주시면 24시간내에 답변 드립니다.`}
          onClick={handleSortCase}
          activeKey={sortCase}
          totalBlogCount={2147}
          recentBlogCount={4142}
        />
      </header>
      <section className={styles['lawyer-list-wrapper']}>
        {lawyerList.map((lawyer, index) => (
          <>
            <LawyerHorizon
              key={lawyer}
              className={styles['lawyer-list-item']}
              name={'홍길동'}
              lawfirm={'example로펌'}
              profileImage='https://picsum.photos/200/300'
              description={`로스쿨 수석!강력사건 전문 해결, 전문 변호사
              오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.
            `}
              ad={true}
              buttonComponent={
                isMobile && (
                  <div className={styles['button-wrapper']}>
                    <Button>변호사페이지</Button>
                    <Button variant='fill'>채팅상담</Button>
                  </div>
                )
              }
              size='small'
            />
            {index !== lawyerList.length - 1 && <Divider padding={16} />}
          </>
        ))}
      </section>
    </div>
  )
}

export default LawyerList
