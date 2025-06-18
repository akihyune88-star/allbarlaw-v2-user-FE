import SvgIcon from '../SvgIcon'
import styles from './play-button.module.scss'

type PlayButtonProps = {
  className?: string
  onNext?: () => void
  onPrev?: () => void
  onToggle?: () => void
  iconColor?: string
  disabledPrev?: boolean
  disabledNext?: boolean
}

const PlayButton = ({
  className,
  onNext,
  onPrev,
  onToggle,
  iconColor = '#fff',
  disabledPrev = false,
  disabledNext = false,
}: PlayButtonProps) => {
  const disabledColor = '#ccc'

  return (
    <div className={`${styles['play-button']} ${className}`}>
      <button onClick={onPrev} disabled={disabledPrev}>
        <SvgIcon name='playButtonArrow' size={16} color={disabledPrev ? disabledColor : iconColor} />
      </button>
      <button onClick={onToggle}>
        <SvgIcon name={'pause'} size={16} color={iconColor} />
      </button>
      <button onClick={onNext} disabled={disabledNext}>
        <SvgIcon
          name='playButtonArrow'
          size={16}
          color={disabledNext ? disabledColor : iconColor}
          style={{ transform: 'rotate(180deg)' }}
        />
      </button>
    </div>
  )
}

export default PlayButton
