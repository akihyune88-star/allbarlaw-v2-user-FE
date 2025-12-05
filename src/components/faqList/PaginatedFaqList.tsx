import { Accordion } from '@/components/accordion'
import Divider from '@/components/divider/Divider'
import React, { useState } from 'react'
import styles from './paginatedFaqList.module.scss'

type FaqItem = {
  faqId: number
  faqTitle: string
  faqContent: string
}

type PaginatedFaqListProps = {
  faqData: FaqItem[]
  itemsPerPage?: number
  className?: string
}

const PaginatedFaqList = ({ faqData, itemsPerPage = 5, className = '' }: PaginatedFaqListProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(faqData.length / itemsPerPage)

  // 현재 페이지에 표시할 데이터 계산
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFaqData = faqData.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={`${styles['paginated-faq-list']} ${className}`}>
      <section className={styles['faq-list']}>
        <Accordion allowMultiple={true}>
          {currentFaqData.map((faq, index) => (
            <React.Fragment key={faq.faqId}>
              <Accordion.Item id={faq.faqId}>
                <Accordion.Title itemId={faq.faqId}>
                  <div className={styles['faq-title']}>
                    <strong>FAQ</strong>
                    <span className={styles['faq-title-text']}>{faq.faqTitle}</span>
                  </div>
                </Accordion.Title>
                <Accordion.Content itemId={faq.faqId}>
                  <div className={styles['faq-content']}>{faq.faqContent}</div>
                </Accordion.Content>
              </Accordion.Item>
              {index !== currentFaqData.length - 1 && <Divider padding={16} />}
            </React.Fragment>
          ))}
        </Accordion>
      </section>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles['pagination']}>
          {/* <button
            className={styles['pagination-button']}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button> */}

          {pageNumbers.map(pageNumber => (
            <button
              key={pageNumber}
              className={`${styles['pagination-number']} ${currentPage === pageNumber ? styles['active'] : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          {/* <button
            className={styles['pagination-button']}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button> */}
        </div>
      )}
    </div>
  )
}

export default PaginatedFaqList
