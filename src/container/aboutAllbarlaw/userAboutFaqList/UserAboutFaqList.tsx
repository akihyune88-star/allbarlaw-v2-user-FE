import { Accordion } from '@/components/accordion'
import Divider from '@/components/divider/Divider'
import Tabs from '@/components/tabs/Tabs'
import React from 'react'
import styles from './userAboutFaqList.module.scss'
import { USER_FAQ } from '@/constants/userFaq'

const tabs = [
  {
    faqTypeId: 1,
    path: 'all',
    name: '전체',
  },
  // {
  //   faqTypeId: 2,
  //   path: 'user',
  //   name: '사용자',
  // },
  // {
  //   faqTypeId: 3,
  //   path: 'lawyer',
  //   name: '변호사',
  // },
]

const UserAboutFaqList = () => {
  const getFaqTypeName = (faqTypeId: number) => {
    return tabs.find((tab: any) => tab.faqTypeId === faqTypeId)?.name
  }
  return (
    <div className={styles['user-about-faq-list']}>
      <h2 className={styles['section-title']}>자주묻는 질문</h2>
      {/* <Tabs items={tabs} onChange={() => {}} initialPath='all' className={styles['tabs']} /> */}
      <section className={styles['faq-list']}>
        <Accordion allowMultiple={true}>
          {USER_FAQ.map((faq: any, index: number) => (
            <React.Fragment key={faq.faqId}>
              <Accordion.Item id={faq.faqId}>
                <Accordion.Title itemId={faq.faqId}>
                  <div className={styles['faq-title']}>
                    {/* <strong>{getFaqTypeName(faq.faqTypeId)}</strong> */}
                    <strong>FAQ</strong>
                    <span className={styles['faq-title-text']}>{faq.faqTitle}</span>
                  </div>
                </Accordion.Title>
                <Accordion.Content itemId={faq.faqId}>
                  <div className={styles['faq-content']}>{faq.faqContent}</div>
                </Accordion.Content>
              </Accordion.Item>
              {index !== USER_FAQ.length - 1 && <Divider padding={16} />}
            </React.Fragment>
          ))}
        </Accordion>
      </section>
    </div>
  )
}

export default UserAboutFaqList
