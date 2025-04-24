import React from 'react'
import styles from '@/components/stepProgressBar/step-progress-bar.module.scss'

export interface StepProgressBarProps {
  steps: number
  currentStep: number
  className?: string
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps, currentStep, className = '' }) => {
  // 진행 비율 계산: 완전히 0%에서 시작하여 100%로 끝나도록
  const progressPercentage = steps > 1 ? ((currentStep - 1) / (steps - 1)) * 100 : 0

  return (
    <div className={`${styles['step-progress-container']} ${className}`}>
      <div className={styles['progress-track']} />
      <div className={styles['progress-bar']} style={{ width: `${progressPercentage}%` }} />

      {Array.from({ length: steps }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={`step-${index}`} className={styles.step}>
            <div
              className={`
                ${styles['step-dot']} 
                ${isActive ? styles.active : ''} 
                ${isCompleted ? styles.completed : styles.inactive}
              `}
            />
          </div>
        )
      })}
    </div>
  )
}

export default StepProgressBar
