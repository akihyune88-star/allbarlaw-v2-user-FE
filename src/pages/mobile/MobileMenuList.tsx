import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'
import styles from './mobileMenuList.module.scss'
import SearchInput from '@/components/searchInput/SearchInput'
import SvgIcon from '@/components/SvgIcon'
import { useCategory } from '@/hooks/queries/useCategory'

const MobileMenuList = () => {
  const navigate = useNavigate()

  const handleMyPage = () => navigate(ROUTER.MYPAGE)
  const handleChat = () => navigate(ROUTER.CHAT)
  const handleLawfirm = () => navigate(ROUTER.LAW_FIRM)
  const handleFaq = () => navigate(ROUTER.FAQ)

  const { data: categoryList } = useCategory()
  console.log('categoryList', categoryList)

  return (
    <main className={styles['mobile-menu-list']}>
      <section className={styles['mobile-menu-list-section']}>
        <header className={styles['mobile-menu-list-header']}>
          <h1>올바로님 반갑습니다.</h1>
          <span>로그아웃</span>
          <div className={styles['mobile-menu-list-header-button']}>
            <button onClick={handleMyPage}>
              <SvgIcon name='user' />
              마이페이지
            </button>
            <button onClick={handleChat}>
              <SvgIcon name='talk' />
              <span></span>상담
            </button>
            <button onClick={handleMyPage}>
              <SvgIcon name='bookMark' />
              찜리스트
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
      <section>
        <header>분류 선택</header>
        <div className={styles['mobile-menu-list-category-container']}>
          {categoryList?.map(category => (
            <button key={category.categoryId} className={styles['mobile-menu-list-category-button']}>
              {category.categoryName}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default MobileMenuList
