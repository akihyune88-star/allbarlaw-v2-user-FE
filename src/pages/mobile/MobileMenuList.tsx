import { ROUTER } from '@/routes/routerConstant'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './mobileMenuList.module.scss'
import SearchInput from '@/components/searchInput/SearchInput'
import SvgIcon from '@/components/SvgIcon'
import { useCategory } from '@/hooks/queries/useCategory'
import { CategoryInfo } from '@/types/categoryTypes'
import { useGetUserProfile } from '@/hooks/queries/useAuth'
import { COLOR } from '@/styles/color'

const MobileMenuList = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMyPage = () => navigate(ROUTER.MYPAGE)
  const handleChat = () => navigate(ROUTER.CHAT)
  const handleNotice = () => navigate(ROUTER.SUPPORT_NOTICE)
  const handleFaq = () => navigate(ROUTER.FAQ)

  const { data: categoryList } = useCategory()
  const { data: userProfile } = useGetUserProfile()

  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  const isLoggedIn = !!accessToken

  const handleCategory = (category: CategoryInfo) => {
    navigate(`/${category.subcategories[0].subcategoryId}`)
  }

  const handleLogin = () => {
    sessionStorage.setItem('redirectAfterLogin', location.pathname)
    navigate(ROUTER.AUTH)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    sessionStorage.removeItem('accessToken')
    window.location.reload()
  }

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <main className={styles['mobile-menu-list']}>
      <section className={styles['mobile-menu-list-section']}>
        <button className={styles['close-button']} onClick={handleClose}>
          ×
        </button>
        {isLoggedIn ? (
          <header className={styles['mobile-menu-list-header']}>
            <div className={styles['header-top']}>
              <h1>{userProfile?.userAccount || '올바로'}님 반갑습니다.</h1>
            </div>
            <div className={styles['mobile-menu-list-header-button-container']}>
              <span>내정보 수정</span>
              <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                로그아웃
              </span>
            </div>
            <div className={styles['mobile-menu-list-header-button']}>
              <button onClick={handleMyPage}>
                <SvgIcon name='user' size={24} color={COLOR.icon_gray_50} />
                <span className={styles['icon-span']}>마이페이지</span>
              </button>
              <button onClick={handleChat}>
                <SvgIcon name='talk' size={24} color={COLOR.icon_gray_50} />
                <span className={styles['icon-span']}>상담</span>
              </button>
              <button onClick={handleMyPage}>
                <SvgIcon name='bookMark' size={24} color={COLOR.icon_gray_50} style={{ cursor: 'pointer' }} />
                <span className={styles['icon-span']}>찜리스트</span>
              </button>
            </div>
          </header>
        ) : (
          <header className={styles['mobile-menu-list-login-required']}>
            <div className={styles['login-required-content']}>
              <h2>로그인이 필요합니다</h2>
              <p>로그인 후 다양한 서비스를 이용해보세요</p>
              <button onClick={handleLogin}>로그인하기</button>
            </div>
          </header>
        )}
        <SearchInput className={styles['search-input-custom']} />
        <button className={styles['mobile-menu-list-button']} onClick={() => navigate(ROUTER.ABOUT)}>
          올바로 소개
        </button>
        <div className={styles['mobile-menu-list-button-container']}>
          <button className={styles['mobile-menu-list-button']} onClick={handleNotice}>
            공지사항
          </button>
          <button className={styles['mobile-menu-list-button']} onClick={handleFaq}>
            FAQ
          </button>
        </div>
      </section>
      <section className={styles['mobile-menu-list-section']}>
        <header>
          <h1 className={styles['mobile-menu-list-header-title']}>분류 선택</h1>
        </header>
        <div className={styles['mobile-menu-list-category-container']}>
          {categoryList?.map(category => (
            <button
              key={category.categoryId}
              className={styles['mobile-menu-list-category-button']}
              onClick={() => handleCategory(category)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={category.clickedImageUrl} alt={category.categoryName} />
                {category.categoryName}
              </div>
              <SvgIcon name='arrowSmall' style={{ transform: 'rotate(135deg)' }} />
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default MobileMenuList
