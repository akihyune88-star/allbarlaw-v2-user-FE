import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import Login from '@/pages/Login'
import Mypage from '@/pages/Mypage'
import { ROUTER } from './routerConstant'
import MainLayout from '@/pages/MainLayout'
import Main from '@/pages/main/Main'
import SubMain from '@/pages/subMain/SubMain'
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
        path: '',
        element: <MainLayout />,
        children: [
          {
            path: '',
            element: <Main />,
          },
          {
            path: ROUTER.SUB_MAIN,
            element: <SubMain />,
            children: [],
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
