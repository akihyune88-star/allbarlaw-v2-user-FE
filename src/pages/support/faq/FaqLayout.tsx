import Tabs from '@/components/tabs/Tabs'
import SupportHeaderTitle from '@/container/support/supportHeader/SupportHeader'
import { useReadFaqType } from '@/hooks/queries/useFaq'
import { ROUTER } from '@/routes/routerConstant'
// import { ROUTER } from '@/routes/routerConstant'
import { useMemo } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

type FaqType = {
  faqTypeId: number
  faqTypeKey: string
  faqTypeName: string
}

const FaqLayout = () => {
  const navigate = useNavigate()
  const { categoryPath } = useParams()
  const { data: faqTypes } = useReadFaqType()

  // 현재 경로에 따라 초기 탭 설정 (경로가 없으면 'all' 기본값)
  const currentPath = categoryPath || 'all'

  const tabItems = useMemo(() => {
    if (!faqTypes) return [] // fallback

    // faqTypes가 배열인지 객체인지 확인 후 처리
    const dataArray = Array.isArray(faqTypes) ? faqTypes : faqTypes.data

    if (!dataArray || !Array.isArray(dataArray)) return []

    return [
      {
        path: 'all',
        name: '전체',
        itemWidth: 60,
      },
      ...dataArray.map((type: FaqType) => ({
        path: String(type.faqTypeId),
        name: type.faqTypeName,
        itemWidth: Math.min((type.faqTypeName?.length || 0) * 12 + 40, 120), // 최대 너비 제한
      })),
    ]
  }, [faqTypes])

  const handleMenuClick = (path: string) => {
    navigate(`${ROUTER.FAQ}/${path}`)
  }

  return (
    <div className='w-full'>
      <header className='page-header-layout'>
        <SupportHeaderTitle title='FAQ' />
        <Tabs items={tabItems} onChange={handleMenuClick} initialPath={currentPath} />
      </header>
      <main className='gray-content-container'>
        <Outlet />
      </main>
    </div>
  )
}

export default FaqLayout
