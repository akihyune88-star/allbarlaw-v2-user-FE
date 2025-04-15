import MainSideBar from '@/container/main/MainSideBar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
      <MainSideBar />
      <Outlet />
    </div>
  )
}

export default MainLayout
