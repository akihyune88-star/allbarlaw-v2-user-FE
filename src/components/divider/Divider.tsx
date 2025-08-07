interface DividerProps {
  padding?: number
  className?: string
}

const Divider = ({ padding = 16, className }: DividerProps) => {
  return (
    <hr 
      className={className}
      style={{ 
        margin: `${padding}px 0`,
        border: 'none',
        borderTop: '1px solid #e6e6e6',
        width: '100%'
      }} 
    />
  )
}

export default Divider
