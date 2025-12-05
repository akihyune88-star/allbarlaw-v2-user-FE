import { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './aboutGoal.module.scss'

const AboutGoal = forwardRef<HTMLDivElement>((_props, ref) => {
  const [titleMoved, setTitleMoved] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const figureRef = useRef<HTMLElement | null>(null)
  const deltaYRef = useRef(0)

  useEffect(() => {
    if (descriptionVisible) {
      // description 애니메이션 시간(0.5s) 후 스크롤 허용
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 500)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [descriptionVisible])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!figureRef.current) return

      const rect = figureRef.current.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (!isVisible) return

      // 아래로 스크롤 (전진)
      if (e.deltaY > 0 && !animationComplete) {
        e.preventDefault()
        deltaYRef.current += e.deltaY

        // 첫 번째 단계: 타이틀 위로 이동
        if (deltaYRef.current > 100 && !titleMoved) {
          setTitleMoved(true)
        }
        // 두 번째 단계: description 나타남
        else if (deltaYRef.current > 300 && titleMoved) {
          setDescriptionVisible(true)
        }
      }
      // 위로 스크롤 (되감기)
      else if (e.deltaY < 0 && (titleMoved || descriptionVisible)) {
        e.preventDefault()
        deltaYRef.current -= Math.abs(e.deltaY)

        // description 숨김
        if (deltaYRef.current < 300 && descriptionVisible) {
          setDescriptionVisible(false)
          setAnimationComplete(false)
        }
        // 타이틀 다시 내림
        if (deltaYRef.current < 100 && titleMoved) {
          setTitleMoved(false)
        }

        // 최소값 제한
        if (deltaYRef.current < 0) {
          deltaYRef.current = 0
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [titleMoved, descriptionVisible, animationComplete])

  return (
    <div className={styles['about-goal']} ref={ref}>
      <h2 className={styles['about-goal-title']}>올바로의 목표</h2>
      <figure className={styles['about-goal-image']} ref={figureRef}>
        {/* <img src={allbarlawGoalImg} alt='about-goal' /> */}
        <div className={styles['about-goal-text-wrapper']}>
          <span className={styles['about-goal-image-title']} data-moved={titleMoved}>
            정확하고 유용한 법률 정보
          </span>
          <p className={styles['about-goal-description-inside']} data-visible={descriptionVisible}>
            인터넷의 법률정보는 제한적이고 부정확해 실제로 유용한 정보를 찾기 어렵습니다. <br />내 사건에 대한 정확한
            정보가 있어야 해결책을 세우고 변호사 선임을 판단할 수 있지만, <br />
            현실에선 첫걸음부터 막힙니다. 올바로는 개인별로 꼭 필요한 법률 정보만 선별·제공해
            <br /> 법률 시장의 정보 비대칭을 해소합니다.
          </p>
        </div>
      </figure>
      <p className={styles['about-goal-description-outside']}>
        인터넷의 법률정보는 제한적이고 부정확해 실제로 유용한 정보를 찾기 어렵습니다. 내 사건에 대한 정확한 정보가
        있어야 해결책을 세우고 변호사 선임을 판단할 수 있지만, 현실에선 첫걸음부터 막힙니다. 올바로는 개인별로 꼭 필요한
        법률 정보만 선별·제공해 법률 시장의 정보 비대칭을 해소합니다.
      </p>
    </div>
  )
})
AboutGoal.displayName = 'AboutGoal'

export default AboutGoal
