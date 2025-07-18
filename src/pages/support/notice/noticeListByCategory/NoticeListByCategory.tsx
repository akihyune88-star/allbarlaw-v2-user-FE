import { useNavigate, useParams } from 'react-router-dom'
import styles from './noticeListByCategory.module.scss'
import { ROUTER } from '@/routes/routerConstant'
import { useInfiniteNoticeList } from '@/hooks/queries/useGetNoticeList'
import dayjs from 'dayjs'
import { useGetNoticeType } from '@/hooks/queries/useGetNoticeType'
import { useMemo } from 'react'
import SvgIcon from '@/components/SvgIcon'

const NoticeListByCategory = () => {
  // const { categoryPath } = useParams()
  const navigate = useNavigate()
  const { data: noticeTypes } = useGetNoticeType()
  const { categoryPath } = useParams()
  console.log(categoryPath)

  const { noticeList, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteNoticeList(
    {
      take: 10,
      cursor: 0,
      cursorId: 0,
      typeId: categoryPath === 'all' ? 'all' : Number(categoryPath),
    },
    categoryPath
  )

  const noticeTypeLookup = useMemo(() => {
    if (!noticeTypes) return {}

    const dataArray = Array.isArray(noticeTypes) ? noticeTypes : noticeTypes.data
    if (!dataArray) return {}

    return dataArray.reduce((acc, type) => {
      acc[type.noticeTypeId] = type.noticeTypeName
      return acc
    }, {} as Record<number, string>)
  }, [noticeTypes])

  const getNoticeTypeName = (noticeTypeId: number) => {
    return noticeTypeLookup[noticeTypeId] || '전체'
  }

  const handleNoticeClick = (noticeId: number, noticeTypeName: string) => {
    navigate(`${ROUTER.SUPPORT_NOTICE}/detail/${noticeId}`, {
      state: {
        noticeTypeName,
      },
    })
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <section className={styles['notice-list-container']}>
        <div>로딩 중...</div>
      </section>
    )
  }

  // 에러가 발생했을 때
  if (isError) {
    return (
      <section className={styles['notice-list-container']}>
        <div>공지사항을 불러오는 중 오류가 발생했습니다.</div>
      </section>
    )
  }

  return (
    <section className={styles['notice-list-container']}>
      {noticeList.length === 0 ? (
        <div className={styles.emptyMessage}>등록된 공지사항이 없습니다.</div>
      ) : (
        <>
          {noticeList.map(notice => {
            const noticeTypeName = getNoticeTypeName(notice.noticeTypeId)
            return (
              <div
                key={notice.noticeId}
                className={styles['notice-item']}
                onClick={() => handleNoticeClick(notice.noticeId, noticeTypeName)}
              >
                <span className={styles['left-container']}>
                  <strong>{noticeTypeName}</strong>
                  <span className={styles['title']}>{notice.noticeTitle}</span>
                </span>
                <span className={styles['created-at']}>{dayjs(notice.noticeCreatedAt).format('YYYY-MM-DD')}</span>
              </div>
            )
          })}

          {/* 더보기 버튼 - 다음 페이지가 있을 때만 표시 */}
          {hasNextPage && (
            <div className={styles['pagination-container']}>
              <button
                className={styles['pagination-button']}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                더보기
                <SvgIcon name='arrowSmall' size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default NoticeListByCategory
