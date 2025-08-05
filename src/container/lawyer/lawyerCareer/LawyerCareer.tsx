import Divider from '@/components/divider/Divider'
import styles from './lawyerCareer.module.scss'
import { forwardRef } from 'react'

interface CareerItem {
  title: string
  contents: string
}

interface LawyerCareerProps {
  careerHistory?: CareerItem[]
  activities?: CareerItem[]
}

const LawyerCareer = forwardRef<HTMLElement, LawyerCareerProps>(
  ({ careerHistory = mockCareerHistory, activities = mockActivities }, ref) => {
  const renderSection = (items: CareerItem[]) => {
    return items.map((item, index) => (
      <div className={styles['lawyer-career__item']} key={index}>
        <h4 className={styles['lawyer-career__item-title']}>{item.title}</h4>
        <ul className={styles['lawyer-career__list']}>
          {item.contents.split('\n').map((content, idx) => (
            <li key={idx}>{content}</li>
          ))}
        </ul>
      </div>
    ))
  }

  return (
    <section ref={ref} className={styles['lawyer-career']}>
      <div className={styles['lawyer-career__group']}>
        <h3 className={styles['lawyer-career__title']}>이력 사항</h3>
        <Divider padding={14} />
        <div className={styles['lawyer-career__section']}>{renderSection(careerHistory)}</div>
      </div>

      <div className={styles['lawyer-career__group']}>
        <h3 className={styles['lawyer-career__title']}>활동 사항</h3>
        <Divider padding={14} />
        <div className={styles['lawyer-career__section']}>{renderSection(activities)}</div>
      </div>
    </section>
  )
  }
)

LawyerCareer.displayName = 'LawyerCareer'

export default LawyerCareer

const mockCareerHistory: CareerItem[] = [
  {
    title: '경력',
    contents: '2019 ~: 파트너스 법률 사무소\n2017 ~ 2019 : 법률사무소 대표이사\n2010 ~ 2017 : 법무법인 다늘',
  },
  {
    title: '자격',
    contents: '2017 : 변리사\n2016 : 미국 변리사 PATENT AGENT\n2011 : 기업기술가치평가사',
  },
  {
    title: '학력',
    contents:
      '2020 : KAIST AIP 제9기 지식재산전략 최고위과정\n2015 ~ 2017 : 한국 대학교 법학전문 대학원 석사\n1999 ~ 2014 : 고려대학교 법과대학 학사',
  },
]

const mockActivities: CareerItem[] = [
  {
    title: '수상',
    contents: '2019 : 중소벤처기업부 장관표창\n2017 : 대한변호사협회 청년변호사상',
  },
  {
    title: '논문/출판',
    contents:
      '2018 : 줄만(월간) 국회도서관 9월호\n2017 : 논문 기업의 영업비밀 보호정책의 한계\n2016 : 논문 협력사를 통한 산업기술유출의 문제점 해결',
  },
  {
    title: '보도',
    contents: '2019 : YTN 지식재산 창출 및 보호 MOU체결',
  },
  {
    title: '기타',
    contents:
      '2020 : 경기지식재산센터 전문가\n2019 : 지식재산보호원 영업비밀보호센터 컨설팅 전문가\n2018 : 서울시 예산정책 연구위원',
  },
]
