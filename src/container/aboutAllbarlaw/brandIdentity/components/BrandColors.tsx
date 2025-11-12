import { COLOR } from '@/styles/color'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './brandColors.module.scss'

const SPAN_MARGIN_RIGHT = '0.5rem'

const BrandColors = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className={styles['brand-colors']}>
      <div className={styles['brand-colors-container']}>
        <header className={styles['brand-colors-header']}>
          <h2 className={styles['brand-colors-header-title']}>Primary Color</h2>
          <p className={styles['brand-colors-header-description']}>
            '올바로'의 전용 컬러는 시그니처와 함께 아이덴티티를 대표하는 중요한 요소입니다. 지속적인 동일 색상의 사용은
            브랜드 이미지 구축에 중요한 역할을 하므로 반드시 본 규정에 명시된 기준에 준하여 일관된 브랜드 이미지를
            유지할 수 있도록 세심한 주의가 필요하며, 사인 제작 시 지정된 메테리얼 소재 색상을 활용하여 시공합니다.
          </p>
        </header>
        <div className={styles['brand-color-items']}>
          <div className={`${styles['brand-color-item']} ${styles['green']}`}>
            <h2 className={styles['brand-color-item-key']}>Key Color Green 01</h2>
            <p className={styles['brand-color-item-code']}>
              <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>RGB</span> R 32 G 191 B 98 <br />
              <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>HEX</span> #20bf62
            </p>
          </div>
          <div className={`${styles['brand-color-item']} ${styles['dark-green']}`}>
            <h2 className={styles['brand-color-item-key']}>Key Color Green 02</h2>
            <p className={styles['brand-color-item-code']}>
              <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>RGB</span> R 35 G 115 B 93 <br />
              <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>HEX</span> #24745e
            </p>
          </div>
          {isMobile ? (
            <>
              <div className={`${styles['brand-color-item']} ${styles['white']}`}>
                <h2 className={styles['brand-color-item-key']} style={{ color: COLOR.bg_black }}>
                  Pure white
                </h2>
                <p className={styles['brand-color-item-code']} style={{ color: COLOR.bg_black }}>
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>RGB</span> R 255 G 255 B 255 <br />
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>HEX</span> #ffffff
                </p>
              </div>
              <div className={`${styles['brand-color-item']} ${styles['black']}`}>
                <h2 className={styles['brand-color-item-key']}>Pure Black</h2>
                <p className={styles['brand-color-item-code']}>
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>RGB</span> R 67 G 67 B 67 <br />
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>HEX</span> #434343
                </p>
              </div>
            </>
          ) : (
            <div className={`${styles['brand-color-item']} ${styles['white-black']}`}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h2 className={styles['brand-color-item-key']} style={{ color: COLOR.bg_black }}>
                  Pure white
                </h2>
                <p className={styles['brand-color-item-code']} style={{ color: COLOR.bg_black }}>
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>RGB</span> R 255 G 255 B 255 <br />
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>HEX</span> #ffffff
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h2 className={styles['brand-color-item-key']}>Pure Black</h2>
                <p className={styles['brand-color-item-code']}>
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>RGB</span> R 67 G 67 B 67 <br />
                  <span style={{ marginRight: SPAN_MARGIN_RIGHT }}>HEX</span> #434343
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrandColors
