import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import Login from '@/pages/Login'
import Mypage from '@/pages/Mypage'
import { ROUTER } from './routerConstant'
import MainLayout from '@/pages/main/MainLayout'
import Main from '@/pages/main/Main'
import SubMain from '@/pages/main/SubMain'
import Support from '@/pages/Support'
import AboutPage from '@/pages/AboutPage'
import BaroTalk from '@/pages/BaroTalk'
import LegalKnowledge from '@/pages/LegalKnowledge'
import LegalDictionary from '@/pages/LegalDictionary'
import LawyerSearch from '@/pages/LawyerSearch'
import LawFirm from '@/pages/LawFirm'

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
      {
        path: ROUTER.SUPPORT,
        element: <Support />,
      },
      {
        path: ROUTER.ABOUT,
        element: <AboutPage />,
      },
      {
        path: ROUTER.BARO_TALK,
        element: <BaroTalk />,
      },
      {
        path: ROUTER.LEGAL_KNOWLEDGE,
        element: <LegalKnowledge />,
      },
      {
        path: ROUTER.LEGAL_DICTIONARY,
        element: <LegalDictionary />,
      },
      {
        path: ROUTER.LAWYER_SEARCH,
        element: <LawyerSearch />,
      },
      {
        path: ROUTER.LAW_FIRM,
        element: <LawFirm />,
      },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
