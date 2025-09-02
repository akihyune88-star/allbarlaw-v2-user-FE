import styles from './legalResourceHighlight.module.scss'
import { video, lawyer, post, knowledge } from '@/assets/imgs'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const LegalResourceHighlight = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const animationItem = [
    {
      itemName: '영상',
      imgPath: video,
      position: { top: '10%', left: '28%' },
      mobilePosition: { top: '15%', left: '2%' },
    },
    {
      itemName: '지식인',
      imgPath: knowledge,
      position: { top: '15%', right: '20%' },
      mobilePosition: { top: '18%', right: '5%' },
    },
    {
      itemName: '변호사',
      imgPath: lawyer,
      position: { bottom: '15%', left: '15%' },
      mobilePosition: { bottom: '10%', left: '-2%' },
    },
    {
      itemName: '글',
      imgPath: post,
      position: { bottom: '1%', right: '25%' },
      mobilePosition: { bottom: '1%', right: '3%' },
    },
  ]

  return (
    <div className={styles['legal-resource-highlight-wrapper']}>
      <div className={styles['legal-resource-highlight']}>
        <h3 className={styles['legal-resource-highlight-subtitle']}>수 많은 정보</h3>
        <h2 className={styles['legal-resource-highlight-title']}>나에게 필요한 법률정보</h2>
        <section className={styles['legal-resource-highlight-animation']}>
          {animationItem.map((item, index) => {
            const currentPosition = isMobile ? item.mobilePosition : item.position

            return (
              <div key={index} className={styles['legal-resource-highlight-animation-item']} style={currentPosition}>
                <img src={item.imgPath} alt={item.itemName} />
                <p>{item.itemName}</p>
              </div>
            )
          })}

          <div className={styles['legal-resource-highlight-animation-content']}>
            <p>
              <strong>2,591</strong>개
            </p>
            <p>수많은 법률 정보</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LegalResourceHighlight
