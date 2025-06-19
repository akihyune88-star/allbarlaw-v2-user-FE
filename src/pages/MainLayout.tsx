import { Outlet } from 'react-router-dom'
import MainSideBar from '@/container/main/sideBar/MainSideBar'
import Footer from '@/components/footer/Footer'

function MainLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <MainSideBar />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
        <Footer style={{ paddingTop: 44 }} />
      </div>
    </div>
  )
}

export default MainLayout
