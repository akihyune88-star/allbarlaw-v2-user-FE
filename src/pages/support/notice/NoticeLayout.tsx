import Tabs from '@/components/tabs/Tabs'
import { NOTICE_CATEGORY } from '@/constants/supportCategory'
import SupportHeaderTitle from '@/container/support/supportHeader/SupportHeader'
import { useGetNoticeType } from '@/hooks/queries/useGetNoticeType'
import { ROUTER } from '@/routes/routerConstant'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useMemo } from 'react'

type NoticeType = {
  noticeTypeId: number
  noticeTypeKey: string
  noticeTypeName: string
}

const NoticeLayout = () => {
  const navigate = useNavigate()
  const { categoryPath } = useParams()
  const { data: noticeTypes } = useGetNoticeType()

  // 현재 경로에 따라 초기 탭 설정 (경로가 없으면 'all' 기본값)
  const currentPath = categoryPath || 'all'

  // API 데이터를 Tabs 컴포넌트 형식으로 변환
  const tabItems = useMemo(() => {
    if (!noticeTypes) return NOTICE_CATEGORY // fallback

    // noticeTypes가 배열인지 객체인지 확인 후 처리
    const dataArray = Array.isArray(noticeTypes) ? noticeTypes : noticeTypes.data

    if (!dataArray) return NOTICE_CATEGORY

    return [
      {
        path: 'all',
        name: '전체',
        itemWidth: 60,
      },
      ...dataArray.map((type: NoticeType) => ({
        path: String(type.noticeTypeId),
        name: type.noticeTypeName,
        itemWidth: type.noticeTypeName.length * 20 + 40, // 글자 수에 따라 동적 계산
      })),
    ]
  }, [noticeTypes])

  const handleMenuClick = (path: string) => {
    navigate(`${ROUTER.SUPPORT_NOTICE}/${path}`)
  }

  return (
    <div className='w-full'>
      <header className='page-header-layout'>
        <SupportHeaderTitle title='공지사항' />
        <Tabs items={tabItems} onChange={handleMenuClick} initialPath={currentPath} />
      </header>
      <main className='gray-content-container'>
        <Outlet />
      </main>
    </div>
  )
}

export default NoticeLayout
