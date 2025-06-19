import SvgIcon from '../SvgIcon'
import styles from './play-button.module.scss'

type PlayButtonProps = {
  className?: string
  onNext?: () => void
  onPrev?: () => void
  onToggle?: () => void
  iconColor?: string
}

const PlayButton = ({ className, onNext, onPrev, onToggle, iconColor = '#fff' }: PlayButtonProps) => {
  const disabledColor = '#ccc'

  return (
    <div className={`${styles['play-button']} ${className}`}>
      <button onClick={onPrev} disabled={!onPrev}>
        <SvgIcon name='playButtonArrow' size={16} color={!onPrev ? disabledColor : iconColor} />
      </button>
      <button onClick={onToggle}>
        <SvgIcon name={'pause'} size={16} color={iconColor} />
      </button>
      <button onClick={onNext} disabled={!onNext}>
        <SvgIcon
          name='playButtonArrow'
          size={16}
          color={!onNext ? disabledColor : iconColor}
          style={{ transform: 'rotate(180deg)' }}
        />
      </button>
    </div>
  )
}

export default PlayButton
