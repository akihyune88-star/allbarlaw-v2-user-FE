import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import Login from '@/pages/Login'
import Mypage from '@/pages/Mypage'
import { ROUTER } from './routerConstant'
import MainLayout from '@/pages/MainLayout'

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
          // {
          //   path: 'sub-route1', // ROUTER.MAIN/sub-route1 경로로 접근 가능
          //   element: <SubRoute1 />, // 해당 컴포넌트는 따로 만들어야함
          // },
          // {
          //   path: 'sub-route2', // ROUTER.MAIN/sub-route2 경로로 접근 가능
          //   element: <SubRoute2 />,
          // },
          // // 필요한 만큼 추가 가능
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
