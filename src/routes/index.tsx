import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import Main from '../pages/Main'
import Login from '@/pages/Login'
import Mypage from '@/pages/Mypage'
import { ROUTER } from './routerConstant'

const router = createBrowserRouter([
  {
    path: ROUTER.MAIN,
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Main />,
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
