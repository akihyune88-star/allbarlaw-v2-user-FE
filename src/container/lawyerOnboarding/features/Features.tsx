import { COLOR } from '@/styles/color'
import styles from './features.module.scss'
import { lawyerConsulting, lawyerExpertis, onboardingCoreValue } from '@/assets/imgs'

const Features = () => {
  return (
    <div>
      <section className={`${styles['section-wrapper']} ${styles['section-title']}`}>
        <span className={styles['section-title-text']}>FEATURES</span>
        <h1 className={styles['section-title-title']}>
          올바로는
          <br />
          이런 플랫폼입니다.
        </h1>
      </section>
      <div className={styles['section-content-wrapper']}>
        <section className={styles['section-content']}>
          <figure className={styles['section-content-image']}>
            <img src={lawyerExpertis} alt='lawyer-expertis' className={styles['section-content-img']} />
          </figure>
          <div className={styles['section-content-text']}>
            <h2 className={styles['section-content-text-title']}>
              전문성을 의뢰인에게
              <br />
              확실하게 어필할 수 있습니다.
            </h2>
            <p className={styles['section-content-text-description']}>
              올바로는 단순한 광고성 홍보를 진행하는 것이 아니라
              <br />
              변호사님들이 시간과 노력을 들여 제작한 컨텐츠(글,영상)을 노출시킵니다.
              <br />
              이를 통해 변호사님이 가진 전문성을 잠재
              <br />
              의로인에게 자연스럽게 드러내고 신뢰를 형성할 수 있습니다.
            </p>
          </div>
        </section>
        <section className={styles['section-content']} style={{ backgroundColor: COLOR.bg_gray_02 }}>
          <div className={styles['section-content-text']}>
            <h2 className={styles['section-content-text-title']}>
              의뢰인과 보다 가깝게
              <br />
              보다 쉽게 소통할 수 있습니다.
            </h2>
            <p className={styles['section-content-text-description']}>
              잠재 의뢰인들은 변호사 선택 과정에서 여러 명에게
              <br />
              동시에 문의를 남기고, 응답이 빠르고 편한 변호사를 선호합니다.
              <br />
              올바로에서는 변호사와 의뢰인이 채팅으로 소통할 수 있게 하여,
              <br />
              진입장벽을 낮추고 더 많은 상담 기회를 확보할 수 있도록 돕습니다.
            </p>
          </div>
          <figure className={styles['section-content-image']}>
            <img src={lawyerConsulting} alt='lawyer-consulting' className={styles['section-content-img']} />
          </figure>
        </section>
      </div>
      <section className={styles['section-footer']}>
        <div className={styles['section-footer-text']}>
          <h2 className={styles['section-footer-text-title']}>
            투자한 노력과 시간이
            <br />
            그대로 결과로 돌아옵니다.
          </h2>
          <p className={styles['section-footer-text-description']}>
            열심히 컨텐츠를 올리고, 성실히 상담을 이어가는 변호사일수록
            <br />
            수임으로 연결될 확률이 높아지는 구조입니다.
            <br />
            이는 단순히 '노출 기회'를 파는 플랏폼과는 달리, 변호사의 시간과 노력이 그대로
            <br />
            성과로 이어지는 공정한 생태계를 만드는 것이 올바로의 핵심 가치입니다.
          </p>
        </div>
        <img src={onboardingCoreValue} alt='onboarding-core-value' className={styles['section-footer-image']} />
      </section>
    </div>
  )
}

export default Features
