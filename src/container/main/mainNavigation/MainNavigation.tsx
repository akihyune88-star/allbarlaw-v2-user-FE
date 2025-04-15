import { guideBanner } from '@/assets/imgs/Index'
import styles from './main-navigation.module.scss'
// import { useNavigate } from 'react-router-dom'

const MainNavigation = () => {
  // const navigate = useNavigate()

  return (
    <div className={styles['container']}>
      <div className={styles['banner-section']}>
        <img
          className={styles['banner-image']}
          src={'https://cdn.crowdpic.net/detail-thumb/thumb_d_1EB6F3DBBA8C2AF2FE8041A572E46140.jpg'}
          alt='변호사 홍보 배너'
        />
        <div className={styles['menu-container']}>
          <button>법률 지식인 질문하기</button>
          <div className={styles['button-wrapper']}>
            <button>변호사 찾기</button>
            <button>올바로 WIKI</button>
          </div>
          <button>사이트 이용 FAQ 바로가기</button>
        </div>
      </div>
      <img className={styles['guide-banner-image']} src={guideBanner} alt='이용 가이드 배너' />
    </div>
  )
}

export default MainNavigation
