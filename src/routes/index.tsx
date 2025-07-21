import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import { ROUTER } from './routerConstant'
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
import TotalSearch from '@/pages/search/totalSearch/TotalSearch'
import SearchBlog from '@/pages/blog/searchBlog/SearchBlog'
import SearchVideo from '@/pages/video/searchVideo/SearchVideo'
import LawyerDetail from '@/pages/lawyer/lawyerDetail/LawyerDetail'
import NoticeLayout from '@/pages/support/notice/NoticeLayout'
import SearchLegalKnowledge from '@/pages/legalKnowledge/searchLegalKnowledge/SearchLegalKnowledge'
import SearchLawyer from '@/pages/lawyer/searchLawyer/SearchLawyer'
import NoticeListByCategory from '@/pages/support/notice/noticeListByCategory/NoticeListByCategory'
import NoticeDetail from '@/pages/support/notice/noticeDetail/NoticeDetail'
import AuthLayout from '@/pages/auth/authLayout/AuthLayout'
import Login from '@/pages/auth/login/Login'
import SignUpMain from '@/pages/auth/signUp/signUpMain/SignUpMain'
import SignUpForm from '@/pages/auth/signUp/signUpForm/SignUpForm'
import SocialCheck from '@/pages/auth/socialCheck/SocialCheck'
import FaqLayout from '@/pages/support/faq/FaqLayout'
import FaqListByCategory from '@/pages/support/faq/faqListByCategory/FaqListByCategory'
import MainLayout from '@/pages/MainLayout'
import { Mypage } from '@/pages'

const router = createBrowserRouter([
  {
    path: ROUTER.MAIN,
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: ROUTER.AUTH,
        element: <AuthLayout />,
        children: [
          {
            path: '',
            element: <Login />,
          },
          {
            path: ROUTER.SIGNUP,
            element: <SignUpMain />,
          },
          {
            path: ROUTER.SIGNUP_FORM,
            element: <SignUpForm />,
          },
        ],
      },
      {
        path: 'social-check/:provider',
        element: <SocialCheck />,
      },
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
              {
                path: 'lawyer/:lawyerId',
                element: <LawyerDetail />,
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
            path: `${ROUTER.SEARCH_MAIN}/:query`,
            element: <SearchMain />,
            children: [
              {
                path: '',
                element: <TotalSearch />,
              },
              {
                path: 'blog',
                element: <SearchBlog />,
              },
              {
                path: 'video',
                element: <SearchVideo />,
              },
              {
                path: 'legal-knowledge',
                element: <SearchLegalKnowledge />,
              },
              {
                path: 'lawyer',
                element: <SearchLawyer />,
              },
            ],
          },
          {
            path: ROUTER.FAQ,
            element: <FaqLayout />,
            children: [
              {
                path: '',
                element: <Navigate to={`${ROUTER.FAQ}/all`} replace />,
              },
              {
                path: ':categoryPath',
                element: <FaqListByCategory />,
              },
            ],
          },
          {
            path: ROUTER.SUPPORT_NOTICE,
            element: <NoticeLayout />,
            children: [
              {
                path: '',
                element: <Navigate to={`${ROUTER.SUPPORT_NOTICE}/all`} replace />,
              },
              {
                path: ':categoryPath',
                element: <NoticeListByCategory />,
              },
              {
                path: 'detail/:noticeId',
                element: <NoticeDetail />,
              },
            ],
          },
        ],
      },
      {
        path: ROUTER.MOBILE_MENU_LIST,
        element: <MobileMenuList />,
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
