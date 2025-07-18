import styles from './faqListByCategory.module.scss'
import { Accordion } from '@/components/accordion'
import Divider from '@/components/divider/Divider'
import React from 'react'

type FaqResponse = {
  faqId: number
  faqTitle: string
  faqContent: string
  faqCreatedAt: string
}

const FaqListByCategory = () => {
  console.log(FaqMockUpData)

  return (
    <div className={styles.faqListByCategory}>
      <Accordion allowMultiple={true}>
        {FaqMockUpData.map((faq: FaqResponse, index: number) => (
          <React.Fragment key={faq.faqId}>
            <Accordion.Item id={faq.faqId}>
              <Accordion.Title itemId={faq.faqId}>
                <div className={styles.faqTitle}>
                  <strong>FAQ</strong>
                  <span>{faq.faqTitle}</span>
                </div>
              </Accordion.Title>
              <Accordion.Content itemId={faq.faqId}>
                <div className={styles.faqContent}>{faq.faqContent}</div>
              </Accordion.Content>
            </Accordion.Item>
            {index !== FaqMockUpData.length - 1 && <Divider padding={16} />}
          </React.Fragment>
        ))}
      </Accordion>
    </div>
  )
}

export default FaqListByCategory

const FaqMockUpData: FaqResponse[] = [
  {
    faqId: 1,
    faqTitle: 'FAQ 제목 1',
    faqContent: 'FAQ 내용 1',
    faqCreatedAt: '2021-01-01',
  },
  {
    faqId: 2,
    faqTitle: 'FAQ 제목 2',
    faqContent: 'FAQ 내용 2',
    faqCreatedAt: '2021-01-02',
  },
  {
    faqId: 3,
    faqTitle: 'FAQ 제목 3',
    faqContent: 'FAQ 내용 3',
    faqCreatedAt: '2021-01-03',
  },
  {
    faqId: 4,
    faqTitle: 'FAQ 제목 4',
    faqContent: 'FAQ 내용 4',
    faqCreatedAt: '2021-01-04',
  },
]
