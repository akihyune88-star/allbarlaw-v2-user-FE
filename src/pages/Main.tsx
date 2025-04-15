import MainSideBar from '@/container/main/MainSideBar'
import { Outlet } from 'react-router-dom'

function Main() {
  return (
    <div>
      <MainSideBar />
      <Outlet />
    </div>
  )
}

export default Main
