import SvgIcon from '@/components/SvgIcon'
import styles from './logoSystem.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const LogoSystem = () => {
  const isMobile = useMediaQuery('(max-width: 56.25rem)')
  return (
    <div className={styles['logo-system']}>
      <div className={styles['logo-system-container']}>
        <header className={styles['logo-system-header']}>
          <h2 className={styles['logo-system-header-title']}>Logo Type Grid System</h2>
          {!isMobile ? (
            <p className={styles['logo-system-header-description']}>
              ‘올바로’의 시그니처는 명시된 비례 및 비율 기준을 준수하여 내부 문서 및 대외용 홍보물, 프로모션류에
              적용하나,
              <br />각 매체의 적용 시 브랜드 가이드라인에 따라 진행될 수 있도록 브랜드 관리부서의 주의와 철저한 관리가
              필요합니다.
            </p>
          ) : (
            <p className={styles['logo-system-header-description']}>
              ‘올바로’의 시그니처는 명시된 비례 및 비율 기준을 준수하여 내부 문서 및 대외용 홍보물, 프로모션류에
              적용하나, 각 매체의 적용 시 브랜드 가이드라인에 따라 진행될 수 있도록 브랜드 관리부서의 주의와 철저한
              관리가 필요합니다.
            </p>
          )}
        </header>
        <figure className={styles['logo-system-image']}>
          <SvgIcon name='logoTypeGridSystem' />
        </figure>
      </div>
    </div>
  )
}

export default LogoSystem
