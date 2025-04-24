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
import LegalKnowledge from '@/pages/LegalKnowledge'
import LegalDictionary from '@/pages/LegalDictionary'
import LawyerSearch from '@/pages/LawyerSearch'
import LawFirm from '@/pages/LawFirm'
import BlogLayout from '@/pages/blog/Blog'
import BlogDetail from '@/pages/blog/BlogDetail'
import RequestBaroTalk from '@/pages/baroTalk/RequestBaroTalk'
import ConsultationContentForm from '@/pages/baroTalk/ConsultationContentForm'
import BaroTalkLawyerSelection from '@/pages/baroTalk/BaroTalkLawyerSelection'
import VideoLayout from '@/pages/video/Video'
import VideoDetail from '@/pages/video/VideoDetail'

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
            path: ':categoryId',
            element: <SubMain />,
            children: [
              {
                path: 'blog',
                element: <BlogLayout />,
              },
              {
                path: 'video',
                element: <VideoLayout />,
              },
            ],
          },
          {
            path: ':categoryId/blog/:blogId',
            element: <BlogDetail />,
          },
          {
            path: ':categoryId/video/:videoId',
            element: <VideoDetail />,
          },
          {
            path: ROUTER.REQUEST_BARO_TALK,
            element: <RequestBaroTalk />,
          },
          {
            path: ROUTER.CONSULTATION_CONTENT_FORM,
            element: <ConsultationContentForm />,
          },
          {
            path: ROUTER.BARO_TALK_LAWYER_SELECTION,
            element: <BaroTalkLawyerSelection />,
          },
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
