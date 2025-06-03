import styles from './legal-term-list.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { Fragment } from 'react/jsx-runtime'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'

const LegalTermKnowledgeList = () => {
  const knowledgeList = [1, 2, 3]
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
  const isMobile = useMediaQuery('(max-width: 80rem)')

  return (
    <div className={styles.container}>
      <header className={`${styles['list-header']} ${styles['knowledge']}`}>
        <h3>법률 지식인</h3>
        <button>
          <span>더보기</span>
          <SvgIcon name='arrowSmall' style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </header>
      {!isMobile && <Divider padding={24} />}
      <section className={styles['list-section']} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {knowledgeList.map((knowledge, index) => (
          <Fragment key={knowledge}>
            <LegalKnowledgeItem
              title='질문지 선택한 내용과, 사건내용을 AI요약한 제목을 보여줍니다.'
              description='음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
              혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
              음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.'
              time={threeHoursAgo}
              lawyerList={[
                {
                  img: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
                  name: '이보람',
                },
                {
                  img: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
                  name: '신중완',
                },
                {
                  img: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
                  name: '백경렬',
                },
              ]}
              isLastAnswer={true}
            />
            {index !== knowledgeList.length - 1 && <Divider padding={0} />}
          </Fragment>
        ))}
      </section>
    </div>
  )
}

export default LegalTermKnowledgeList
