import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import Login from '@/pages/Login'
import Mypage from '@/pages/Mypage'
import { ROUTER } from './routerConstant'
import MainLayout from '@/pages/MainLayout'
import Main from '@/pages/main/Main'
import SubMain from '@/pages/subMain/SubMain'
import BlogLayout from '@/pages/blog/Blog'
import BlogDetail from '@/pages/blog/BlogDetail'
import RequestBaroTalk from '@/pages/baroTalk/RequestBaroTalk'
import ConsultationContentForm from '@/pages/baroTalk/ConsultationContentForm'
import BaroTalkLawyerSelection from '@/pages/baroTalk/BaroTalkLawyerSelection'
import VideoLayout from '@/pages/video/Video'
import VideoDetail from '@/pages/video/VideoDetail'
import LegalKnowledgeLayout from '@/pages/legalKnowledge/LegalKnowledge'
import LawyerLayout from '@/pages/lawyer/Lawyer'
import SubcategoryLawfirmLayout from '@/pages/lawfirm/SubCategoryLawfirm'
import TotalSubMain from '@/pages/subMain/TotalSubMain'
import LegalDictionary from '@/pages/legalDictionary/LegalDictionary'
import AboutAllbarlaw from '@/pages/aboutAllbarlaw/AboutAllbarlaw'
import SearchMain from '@/pages/search/SearchMain'
import DictionaryMain from '@/pages/legalDictionary/DictionaryMain'
import LegalTermDetail from '@/pages/legalTermDetail/LegalTermDetail'
import MobileMenuList from '@/pages/mobile/MobileMenuList'
import LegalKnowledgeDetail from '@/pages/legalKnowledge/LegalKnowledgeDetail'

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
            path: ':subcategoryId',
            element: <SubMain />,
            children: [
              {
                path: '',
                element: <TotalSubMain />,
              },
              {
                path: 'blog',
                element: <BlogLayout />,
              },
              {
                path: 'video',
                element: <VideoLayout />,
              },
              {
                path: 'legal-knowledge',
                element: <LegalKnowledgeLayout />,
              },
              {
                path: 'lawyer',
                element: <LawyerLayout />,
              },
              {
                path: 'law-firm',
                element: <SubcategoryLawfirmLayout />,
              },
            ],
          },
          {
            path: ':subcategoryId/blog/:blogCaseId',
            element: <BlogDetail />,
          },
          {
            path: ':subcategoryId/video/:videoId',
            element: <VideoDetail />,
          },
          {
            path: ':subcategoryId/legal-knowledge/:knowledgeId',
            element: <LegalKnowledgeDetail />,
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
          {
            path: ROUTER.MYPAGE,
            element: <Mypage />,
          },
          {
            path: ROUTER.LEGAL_DICTIONARY,
            element: <LegalDictionary />,
            children: [
              {
                path: '',
                element: <DictionaryMain />,
              },
              {
                path: ':termId',
                element: <LegalTermDetail />,
              },
            ],
          },
          {
            path: ROUTER.SEARCH_MAIN,
            element: <SearchMain />,
          },
          {
            path: ROUTER.MOBILE_MENU_LIST,
            element: <MobileMenuList />,
          },
        ],
      },
      {
        path: ROUTER.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTER.ABOUT,
        element: <AboutAllbarlaw />,
      },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
