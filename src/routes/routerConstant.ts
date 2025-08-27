export const ROUTER = {
  // Auth
  AUTH: '/auth',
  LOGIN: '/login',
  ID_FIND: '/id-find',
  PASSWORD_RESET: '/password-reset',
  SIGNUP: 'signup',
  SIGNUP_FORM: 'signup-form',
  SOCIAL_CHECK: '/social-check',
  LAWYER_SIGNUP_FORM: 'lawyer-signup-form',
  LAWYER_LOGIN: '/lawyer-login',
  LAWYER_ADMIN: '/lawyer-admin',
  FIND_ID: 'find-id',
  RESET_PASSWORD: 'reset-password',
  LAWYER_FIND_ID: 'lawyer-find-id',
  LAWYER_RESET_PASSWORD: 'lawyer-reset-password',

  // 마이페이지
  MYPAGE: '/mypage',
  KEEP_LIST: 'keep-list',
  CHAT_LIST: 'chat-list',

  SUPPORT: '/support',
  ABOUT: '/about',

  // baroTalk
  BARO_TALK: '/baro-talk',
  REQUEST_BARO_TALK: '/request-baro-talk',
  CONSULTATION_CONTENT_FORM: '/consultation-content-form',
  BARO_TALK_LAWYER_SELECTION: '/baro-talk-lawyer-selection',
  CHAT: '/chat',

  LEGAL_DICTIONARY: '/legal-dictionary',
  LAWYER_SEARCH: '/lawyer-search',
  LAW_FIRM: '/law-firm',
  MAIN: '/',
  SUB_MAIN: '/:subcategoryId',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:blogId',
  VIDEO: '/video',
  LEGAL_KNOWLEDGE: '/legal-knowledge',
  LAWYER: '/lawyer',

  SEARCH_MAIN: '/search',
  MOBILE_MENU_LIST: '/mobile-menu-list',
  FAQ: '/faq',
  SUPPORT_NOTICE: '/support-notice',
  LAWYER_DETAIL: '/lawyer',
  NOT_FOUND: '*',

  // 변호사 관리
  LAWYER_ADMIN_CHAT_LIST: '/lawyer-admin/chat-list',
  LAWYER_ADMIN_CHAT: '/lawyer-admin/chat',

  LAWYER_ADMIN_LAWYER_DETAIL: '/lawyer-admin/lawyer-detail',
  LAWYER_ADMIN_LAWYER_EDIT: '/lawyer-admin/lawyer-edit',
  LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO: '/lawyer-admin/lawyer-edit/basic-info',
  LAWYER_ADMIN_LAWYER_EDIT_ACTIVITY: '/lawyer-admin/lawyer-edit/activity',
  LAWYER_ADMIN_LAWYER_EDIT_CAREER: '/lawyer-admin/lawyer-edit/career',
} as const
