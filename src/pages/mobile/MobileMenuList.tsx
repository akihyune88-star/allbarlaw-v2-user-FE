import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'
import styles from './mobileMenuList.module.scss'
import SearchInput from '@/components/searchInput/SearchInput'
import SvgIcon from '@/components/SvgIcon'
import { useCategory } from '@/hooks/queries/useCategory'
import { CategoryInfo } from '@/types/categoryTypes'

const MobileMenuList = () => {
  const navigate = useNavigate()

  const handleMyPage = () => navigate(ROUTER.MYPAGE)
  const handleChat = () => navigate(ROUTER.CHAT)
  const handleLawfirm = () => navigate(ROUTER.LAW_FIRM)
  const handleFaq = () => navigate(ROUTER.FAQ)

  const { data: categoryList } = useCategory()

  const handleCategory = (category: CategoryInfo) => {
    navigate(`/${category.subcategories[0].subcategoryId}`)
  }

  return (
    <main className={styles['mobile-menu-list']}>
      <section className={styles['mobile-menu-list-section']}>
        <header className={styles['mobile-menu-list-header']}>
          <h1>올바로님 반갑습니다.</h1>
          <span>로그아웃</span>
          <div className={styles['mobile-menu-list-header-button']}>
            <button onClick={handleMyPage}>
              <SvgIcon name='user' size={24} />
              <span className={styles['icon-span']}>마이페이지</span>
            </button>
            <button onClick={handleChat}>
              <SvgIcon name='talk' size={24} />
              <span className={styles['icon-span']}>상담</span>
            </button>
            <button onClick={handleMyPage}>
              <SvgIcon name='bookMark' size={24} style={{ cursor: 'pointer' }} />
              <span className={styles['icon-span']}>찜리스트</span>
            </button>
          </div>
        </header>
        <SearchInput />
        <button className={styles['mobile-menu-list-button']}>올바로 소개</button>
        <div className={styles['mobile-menu-list-button-container']}>
          <button className={styles['mobile-menu-list-button']} onClick={handleLawfirm} disabled={true}>
            로펌/법률사무소
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
