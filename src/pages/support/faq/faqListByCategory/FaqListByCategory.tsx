import styles from './faqListByCategory.module.scss'
import { Accordion } from '@/components/accordion'
import Divider from '@/components/divider/Divider'
import React from 'react'
import { useInfiniteFaqList } from '@/hooks/queries/useFaq'
import SvgIcon from '@/components/SvgIcon'

const FaqListByCategory = () => {
  const { faqList, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteFaqList({
    take: 10,
    cursor: 0,
    cursorId: 0,
    faqTypeId: 'all',
  })

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className={styles.faqListByCategory}>
        <div>로딩 중...</div>
      </div>
    )
  }

  // 에러가 발생했을 때
  if (isError) {
    return (
      <div className={styles.faqListByCategory}>
        <div>FAQ를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.faqListByCategory}>
      <Accordion allowMultiple={true}>
        {faqList.map((faq: any, index: number) => (
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
            {index !== faqList.length - 1 && <Divider padding={16} />}
          </React.Fragment>
        ))}
      </Accordion>

      {/* 더보기 버튼 - 다음 페이지가 있을 때만 표시 */}
      {hasNextPage && (
        <div className={styles['pagination-container']}>
          <button className={styles['pagination-button']} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            더보기
            <SvgIcon name='arrowSmall' size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default FaqListByCategory
