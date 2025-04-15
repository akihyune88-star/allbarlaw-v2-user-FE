import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import Login from '@/pages/Login'
import Mypage from '@/pages/Mypage'
import { ROUTER } from './routerConstant'
import MainLayout from '@/pages/main/MainLayout'
import Main from '@/pages/main/Main'
import SubMain from '@/pages/main/SubMain'

const router = createBrowserRouter([
  {
    path: ROUTER.MAIN,
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '', // 이렇게 비워두면 ROUTER.MAIN과 동일한 경로를 의미
        element: <MainLayout />,
        children: [
          // // 여기에 Main 하위의 중첩 라우트를 추가
          {
            path: '', // ROUTER.MAIN/sub-route1 경로로 접근 가능
            element: <Main />, // 해당 컴포넌트는 따로 만들어야함
          },
          {
            path: ROUTER.SUB_MAIN, // ROUTER.MAIN/sub-route2 경로로 접근 가능
            element: <SubMain />,
          },
          // 필요한 만큼 추가 가능
        ],
      },
      {
        path: ROUTER.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTER.MYPAGE,
        element: <Mypage />,
      },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
