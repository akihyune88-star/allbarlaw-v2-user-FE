import { useState, useRef, useEffect } from 'react'
import styles from '@/components/detailHeader/detail-header.module.scss'
import Button from '../button/Button'
import SvgIcon from '../SvgIcon'
import { COLOR } from '@/styles/color'
import type { FontSizeLevel } from '@/stores/fontSizeStore'

type DetailHeaderProps = {
  title: string
  onShare?: () => void
  onSave?: () => void
  isKeep?: boolean
  className?: string
  onFontSizeChange?: (size: FontSizeLevel) => void
  fontSize?: FontSizeLevel
}

const FONT_SIZE_OPTIONS: { value: FontSizeLevel; label: string }[] = [
  { value: 'xs', label: '작게' },
  { value: 'sm', label: '보통' },
  { value: 'md', label: '크게' },
  { value: 'lg', label: '아주크게' },
  { value: 'xl', label: '최대크게' },
]

const DetailHeader = ({
  title,
  onShare,
  onSave,
  isKeep,
  className,
  onFontSizeChange,
  fontSize = 'sm',
}: DetailHeaderProps) => {
  const [fontSizeOpen, setFontSizeOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFontSizeSelect = (size: FontSizeLevel) => {
    onFontSizeChange?.(size)
  }

  // 외부 클릭 시 팝오버 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFontSizeOpen(false)
      }
    }

    if (fontSizeOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [fontSizeOpen])

  return (
    <div className={`${styles['detail-header']} ${className}`}>
      <h1>{title}</h1>
      <div className={styles['button-wrapper']}>
        {onFontSizeChange && (
          <div ref={containerRef} className={styles['font-size-container']}>
            <Button variant='share' onClick={() => setFontSizeOpen(!fontSizeOpen)}>
              크기
              <SvgIcon name='textSize' size={16} style={{ cursor: 'pointer' }} />
            </Button>
            {fontSizeOpen && (
              <div className={styles['font-size-popover']}>
                <div className={styles['font-size-selector']}>
                  <div className={styles['font-size-options']}>
                    <div className={styles['font-size-track']} />
                    {FONT_SIZE_OPTIONS.map(option => (
                      <div className={styles['font-size-option-wrapper']} key={option.value}>
                        <button
                          className={`${styles['font-size-option']} ${fontSize === option.value ? styles.active : ''}`}
                          onClick={() => handleFontSizeSelect(option.value)}
                        >
                          <span className={styles[`preview-${option.value}`]}>가</span>
                        </button>
                        <label className={styles['font-size-label']}>{option.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {onShare && (
          <Button variant='share' onClick={onShare}>
            공유
            <SvgIcon name='share' size={16} style={{ cursor: 'pointer' }} />
          </Button>
        )}
        {onSave && (
          <Button variant='save' onClick={onSave}>
            저장 <SvgIcon name='save' size={16} fill={isKeep ? COLOR.green_01 : 'none'} style={{ cursor: 'pointer' }} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default DetailHeader
