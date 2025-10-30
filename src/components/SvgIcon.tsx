import React, { JSX } from 'react'
import * as Icons from '@/assets/svgs'
import { KeyOfIcon } from '@/types/svg'

interface SvgIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: KeyOfIcon
  size?: number
  strokeWidth?: number
  color?: string
  onClick?: () => void
}

const SvgIcon = ({
  name,
  width: _width,
  height: _height,
  size,
  strokeWidth,
  color,
  onClick,
  style,
  ...props
}: SvgIconProps): JSX.Element => {
  const IconComponent = Icons[name as keyof typeof Icons]
  const width = _width ?? size
  const height = _height ?? size
  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  const svgStyle: React.CSSProperties = {
    ...style,
    ...(strokeWidth ? { strokeWidth } : {}),
  }

  return (
    <span
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        color: color,
        ...style,
      }}
    >
      <IconComponent {...props} {...sizeProps} style={svgStyle} />
    </span>
  )
}

export default SvgIcon
