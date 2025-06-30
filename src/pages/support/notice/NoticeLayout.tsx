import Tabs from '@/components/tabs/Tabs'
import { NOTICE_CATEGORY } from '@/constants/supportCategory'
import SupportHeaderTitle from '@/container/support/supportHeader/SupportHeader'
import { ROUTER } from '@/routes/routerConstant'
import { Outlet, useNavigate } from 'react-router-dom'

const NoticeLayout = () => {
  const navigate = useNavigate()

  const handleMenuClick = (path: string) => {
    navigate(`${ROUTER.NOTICE}${path}`)
  }

  return (
    <div className='w-full'>
      <header className='page-header-layout'>
        <SupportHeaderTitle title='공지사항' />
        <Tabs items={NOTICE_CATEGORY} onChange={handleMenuClick} initialPath={'/'} />
      </header>
      <main className='gray-content-container'>
        <Outlet />
      </main>
    </div>
  )
}

export default NoticeLayout
