import { FaqResponse } from '@/types/supportTypes'
import styles from './faqListByCategory.module.scss'
import { Accordion } from '@/components/accordion'
import Divider from '@/components/divider/Divider'

const FaqListByCategory = () => {
  console.log(FaqMockUpData)

  return (
    <div className={styles.faqListByCategory}>
      <Accordion allowMultiple={true}>
        {FaqMockUpData.map((faq, index) => (
          <>
            <Accordion.Item key={faq.faqId} id={faq.faqId}>
              <Accordion.Title itemId={faq.faqId}>
                <div className={styles.faqTitle}>
                  <strong>공지</strong>
                  <span>
                    제목을 1줄 이내로 보여줍니다. 제목을 1줄 이내로 보여줍니다. 제목을 1줄 이내로 보여줍니다제목을 1줄
                    이내로 보여줍니다제목을 1줄 이내로 보여줍니다.
                  </span>
                </div>
              </Accordion.Title>
              <Accordion.Content itemId={faq.faqId}>
                <div className={styles.faqContent}>{faq.faqContent}</div>
              </Accordion.Content>
            </Accordion.Item>
            {index !== FaqMockUpData.length - 1 && <Divider padding={16} />}
          </>
        ))}
      </Accordion>
    </div>
  )
}

export default FaqListByCategory

const FaqMockUpData: FaqResponse = [
  {
    faqId: 1,
    faqTitle: '공지사항',
    faqContent: '공지사항 내용',
    faqCreatedAt: '2021-01-01',
  },
  {
    faqId: 2,
    faqTitle: '공지사항2',
    faqContent: '공지사항 내용2',
    faqCreatedAt: '2021-01-02',
  },
  {
    faqId: 3,
    faqTitle: '공지사항3',
    faqContent: '공지사항 내용3',
    faqCreatedAt: '2021-01-03',
  },
  {
    faqId: 4,
    faqTitle: '공지사항4',
    faqContent: '공지사항 내용4',
    faqCreatedAt: '2021-01-04',
  },
]
