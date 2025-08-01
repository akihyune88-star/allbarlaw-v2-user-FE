import React from 'react'
import Button from '@/components/button/Button'
import styles from '@/components/progressButton/progress-button.module.scss'
import StepProgressBar from '@/components/stepProgressBar'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type ProgressButtonProps = {
  onCancel: () => void
  onPrev?: () => void
  onNext: () => void
  style?: React.CSSProperties
  steps: number
  currentStep: number
  disabled?: boolean // 추가된 disabled prop
}

const ProgressButton = ({
  onCancel,
  onNext,
  onPrev,
  style,
  steps,
  currentStep,
  disabled = false,
}: ProgressButtonProps) => {
  const isMobile = useMediaQuery('(max-width: 1279px)')

  if (isMobile) {
    return (
      <div className={styles['button-navigation']} style={style}>
        <StepProgressBar steps={steps} currentStep={currentStep} className={styles['progress-bar']} />
        <div className={styles['button-wrapper']}>
          <Button variant='normal' onClick={onCancel} style={{ width: 80 }}>
            취소
          </Button>
          <div style={{ display: 'flex', gap: 10 }}>
            {onPrev && (
              <Button variant='normal' onClick={onCancel} className={styles['prev-button']}>
                이전
              </Button>
            )}
            <Button variant='fill' size='large' style={{ width: 120 }} onClick={onNext} disabled={disabled}>
              저장 및 다음
            </Button>
          </div>
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
        <div style={{ display: 'flex', gap: 10 }}>
          {onPrev && (
            <Button variant='normal' onClick={onCancel} className={styles['prev-button']}>
              이전
            </Button>
          )}
          <Button variant='fill' size='large' onClick={onNext} disabled={disabled}>
            저장 및 다음
          </Button>
        </div>
      </div>
    )
  }
}

export default ProgressButton
