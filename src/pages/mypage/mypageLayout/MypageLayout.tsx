import MypageHeader from '@/container/mypage/mypageHeader/MypageHeader'
import { Outlet } from 'react-router-dom'

const MypageLayout = () => {
  return (
    <div>
      <MypageHeader />
      <Outlet />
    </div>
  )
}

export default MypageLayout
