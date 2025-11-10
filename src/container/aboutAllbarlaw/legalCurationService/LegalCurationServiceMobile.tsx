import { legalCurationService } from '@/assets/imgs'
import styles from './legalCurationServiceMobile.module.scss'
import { forwardRef } from 'react'

const LegalCurationServiceMobile = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <section className={styles['legal-curation-service']} ref={ref}>
      <div className={styles['legal-curation-service-content']}>
        <div className={styles['legal-curation-service-title']}>의뢰인과 변호사와의 연결고리</div>
        <div className={styles['legal-curation-service-image-wrapper']}>
          <img
            src={legalCurationService}
            alt='legal-curation-service'
            className={styles['legal-curation-service-image']}
          />
        </div>
        <div className={styles['legal-curation-service-text']}>
          <h2>
            나에게 꼭 필요한
            <br />
            법률정보만 골라볼 순 없을까?
          </h2>
          <p>
            세상에 똑같은 고민은 없기에
            <br />
            오직 나만을 위한 해결책이 필요합니다 <br />
            수많은 올바로의 법률정보 속에서
            <br />내 문제의 해결책을 찾아보시기 바랍니다.
          </p>
        </div>
      </div>
    </section>
  )
})

LegalCurationServiceMobile.displayName = 'LegalCurationServiceMobile'

export default LegalCurationServiceMobile
