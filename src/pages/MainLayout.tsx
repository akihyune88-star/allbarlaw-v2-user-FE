import { Outlet } from 'react-router-dom'
import MainSideBar from '@/container/main/sideBar/MainSideBar'

function MainLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <MainSideBar />
      <Outlet />
    </div>
  )
}

export default MainLayout
