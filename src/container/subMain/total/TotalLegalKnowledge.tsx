import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Button from '@/components/button/Button'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import SvgIcon from '@/components/SvgIcon'
import styles from '@/container/subMain/total/total-legal-knowledge.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const TotalLegalKnowledge = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const mapItem = [1, 2, 3, 4]

  return (
    <section className={styles.container}>
      <aside className={styles.aside}>
        {isMobile ? (
          <ArticleHeader title='최신 법률지식인' totalBlogCount={21321} recentBlogCount={1314} type='total' />
        ) : (
          <>
            <div className={styles.aside__header}>
              <h3 className={styles[`aside__header-title`]}>{`최신 \n법률지식인`}</h3>
              <span className={styles['aside__header-count']}>
                전체 21,321상담
                <br />
                최근 한달 1,314상담
              </span>
              <button className={'total-view-button'}>
                <span>전체보기</span>
                <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(-90deg)' }} />
              </button>
            </div>
            <Button variant='normal' size='small' className={styles['question-button']}>
              질문하기
            </Button>
          </>
        )}
      </aside>
      <div className={styles['content-area']}>
        {mapItem.map(item => (
          <LegalKnowledgeItem
            key={item}
            title='주차장 음주운전, 잠깐의 방심으로 억울하게 처벌받을 위기 어떻게 해야 할까?'
            description='음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어
          음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어...'
            time={new Date()}
            isLastAnswer={true}
            lawyerList={[{ img: 'https://dimg.donga.com/wps/NEWS/IMAGE/2023/05/24/119463126.1.jpg', name: '양정아' }]}
          />
        ))}
      </div>
    </section>
  )
}

export default TotalLegalKnowledge
