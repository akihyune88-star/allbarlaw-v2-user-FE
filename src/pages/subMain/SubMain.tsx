import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
import CategoryTitle from '@/container/subMain/CategoryTitle'
import { SUB_MENU_LIST } from '@/constants/submainConstants'
import Tabs from '@/components/tabs/Tabs'
import { useEffect, useState } from 'react'

const SubMain = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey(prev => prev + 1)
  }, [subcategoryId])

  const handleMenuClick = (path: string) => {
    navigate(`/${subcategoryId}${path}`)
  }

  const currentTabPath = location.pathname.replace(`/${subcategoryId}`, '') || '/'

  return (
    <div className='w-full'>
      <header className='page-header-layout'>
        <CategoryTitle />
        <Tabs key={key} items={SUB_MENU_LIST} onChange={handleMenuClick} initialPath={currentTabPath} />
      </header>
      <main className='gray-content-container'>
        <Outlet />
      </main>
    </div>
  )
}

export default SubMain
