import { Outlet } from 'react-router-dom'
import MainSideBar from '@/container/main/mainSideBar/MainSideBar'

function MainLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <MainSideBar />
      <Outlet />
    </div>
  )
}

export default MainLayout
