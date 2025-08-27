import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import { ROUTER } from './routerConstant'
import Main from '@/pages/main/Main'
import SubMain from '@/pages/subMain/SubMain'
import BlogDetail from '@/pages/blog/BlogDetail'
import VideoLayout from '@/pages/video/video/Video'
import VideoDetail from '@/pages/video/VideoDetail'
import LegalKnowledgeLayout from '@/pages/legalKnowledge/LegalKnowledge'
import LawyerLayout from '@/pages/lawyer/Lawyer'
import SubcategoryLawfirmLayout from '@/pages/lawfirm/SubCategoryLawfirm'
import TotalSubMain from '@/pages/subMain/TotalSubMain'
import LegalDictionary from '@/pages/legalDictionary/LegalDictionary'
import AboutAllbarlaw from '@/pages/aboutAllbarlaw/AboutAllbarlaw'
import SearchMain from '@/pages/search/main/SearchMain'
//법률백과사전
import DictionaryMain from '@/pages/legalDictionary/DictionaryMain'
import MobileMenuList from '@/pages/mobile/MobileMenuList'
import LegalKnowledgeDetail from '@/pages/legalKnowledge/LegalKnowledgeDetail'
import TotalSearch from '@/pages/search/totalSearch/TotalSearch'
import SearchBlog from '@/pages/search/searchBlog/SearchBlog'
import SearchVideo from '@/pages/search/searchVideo/SearchVideo'
import NoticeLayout from '@/pages/support/notice/NoticeLayout'
import SearchLegalKnowledge from '@/pages/search/searchLegalKnowledge/SearchLegalKnowledge'
import SearchLawyer from '@/pages/search/searchLawyer/SearchLawyer'
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
import { ProtectedRoute } from '@/components/ProtectedRoute'
import {
  BaroTalkLawyerSelection,
  BlogLayout,
  Chat,
  ConsultationContentForm,
  LawyerAdminLayout,
  LawyerChatList,
  LawyerSignupForm,
  LegalTermDetail,
  Mypage,
  RequestBaroTalk,
} from '@/pages'
import LawyerChat from '@/pages/lawyerAdmin/chat/lawyerChat/LawyerChat'
import LawyerDetail from '@/pages/lawyer/lawyerDetail/LawyerDetail'
import FindId from '@/pages/auth/findId/FindId'
import ResetPassword from '@/pages/auth/resetPassword/ResetPassword'
import LawyerFindId from '@/pages/auth/lawyerFindId/LawyerFindId'
import LawyerResetPassword from '@/pages/auth/lawyerResetPassword/LawyerResetPassword'
import AdminLawyerDetail from '@/pages/lawyerAdmin/lawyerInfo/adminLawyerDetail/AdminLawyerDetail'
import LawyerEditLayout from '@/pages/lawyerAdmin/lawyerInfo/lawyerEditLayout/LawyerEditLayout'
import BasicInfoEdit from '@/pages/lawyerAdmin/lawyerInfo/basicInfoEdit/BasicInfoEdit'
import LawyerEditActivity from '@/pages/lawyerAdmin/lawyerInfo/lawyerEditActivity/LawyerEditActivity'
import LawyerEditCareer from '@/pages/lawyerAdmin/lawyerInfo/lawyerEditCareer/LawyerEditCareer'

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
          {
            path: ROUTER.LAWYER_SIGNUP_FORM,
            element: <LawyerSignupForm />,
          },
          {
            path: ROUTER.FIND_ID,
            element: <FindId />,
          },
          {
            path: ROUTER.RESET_PASSWORD,
            element: <ResetPassword />,
          },
          {
            path: ROUTER.LAWYER_FIND_ID,
            element: <LawyerFindId />,
          },
          {
            path: ROUTER.LAWYER_RESET_PASSWORD,
            element: <LawyerResetPassword />,
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
          // baroTalk - 일반 유저만 접근 가능
          {
            path: ROUTER.REQUEST_BARO_TALK,
            element: (
              <ProtectedRoute requireUser={true}>
                <RequestBaroTalk />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTER.CONSULTATION_CONTENT_FORM,
            element: (
              <ProtectedRoute requireUser={true}>
                <ConsultationContentForm />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTER.BARO_TALK_LAWYER_SELECTION,
            element: (
              <ProtectedRoute requireUser={true}>
                <BaroTalkLawyerSelection />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTER.CHAT,
            element: (
              <ProtectedRoute requireUser={true}>
                <Chat />
              </ProtectedRoute>
            ),
          },
          //myPage - 일반 유저만 접근 가능
          {
            path: ROUTER.MYPAGE,
            element: (
              <ProtectedRoute requireUser={true}>
                <Mypage />
              </ProtectedRoute>
            ),
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
            path: '/search/blog/:blogCaseId',
            element: <BlogDetail />,
          },
          {
            path: '/search/video/:videoId',
            element: <VideoDetail />,
          },
          {
            path: '/search/legal-knowledge/:knowledgeId',
            element: <LegalKnowledgeDetail />,
          },
          {
            path: '/search/lawyer/:lawyerId',
            element: <LawyerDetail />,
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
  {
    path: ROUTER.LAWYER_ADMIN,
    element: (
      <ProtectedRoute requireLawyer={true}>
        <LawyerAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to={ROUTER.LAWYER_ADMIN_LAWYER_DETAIL} replace />,
      },
      {
        path: ROUTER.LAWYER_ADMIN_LAWYER_DETAIL,
        element: <AdminLawyerDetail />,
      },
      {
        path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT,
        element: <LawyerEditLayout />,
        children: [
          {
            path: '',
            element: <Navigate to={ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO} replace />,
          },
          {
            path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO,
            element: <BasicInfoEdit />,
          },
          {
            path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_CAREER,
            element: <LawyerEditCareer />,
          },
          {
            path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_ACTIVITY,
            element: <LawyerEditActivity />,
          },
        ],
      },
      {
        path: ROUTER.LAWYER_ADMIN_CHAT_LIST,
        element: <LawyerChatList />,
      },
      {
        path: ROUTER.LAWYER_ADMIN_CHAT,
        element: <LawyerChat />,
      },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
