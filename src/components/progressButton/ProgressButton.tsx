import React from 'react'
import Button from '@/components/button/Button'
import styles from '@/components/progressButton/progress-button.module.scss'
import StepProgressBar from '@/components/stepProgressBar'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type ProgressButtonProps = {
  onCancel: () => void
  onNext: () => void
  style?: React.CSSProperties
  steps: number
  currentStep: number
}

const ProgressButton = ({ onCancel, onNext, style, steps, currentStep }: ProgressButtonProps) => {
  const isMobile = useMediaQuery('(max-width: 1279px)')

  if (isMobile) {
    return (
      <div className={styles['button-navigation']} style={style}>
        <StepProgressBar steps={steps} currentStep={currentStep} className={styles['progress-bar']} />
        <div className={styles['button-wrapper']}>
          <Button variant='normal' onClick={onCancel}>
            취소
          </Button>
          <Button variant='fill' size='large' style={{ width: 120 }} onClick={onNext}>
            저장 및 다음
          </Button>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles['button-navigation']} style={style}>
        <Button variant='normal' onClick={onCancel}>
          취소
        </Button>
        <div className={styles['progress-wrapper']}>
          <StepProgressBar steps={steps} currentStep={currentStep} className={styles['progress-bar']} />
        </div>
        <Button variant='fill' size='large' onClick={onNext}>
          저장 및 다음
        </Button>
      </div>
    )
  }
}

export default ProgressButton
