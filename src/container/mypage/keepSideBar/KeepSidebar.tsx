import styles from './keepSidebar.module.scss'

const buttonList = ['법률정보의 글', '변호사의 영상', '법률 지식인', '변호사', '법률 사전']

interface KeepSidebarProps {
  buttonList: string[]
  activeButton: string
  setActiveButton: (button: string) => void
}

const KeepSidebar = ({ buttonList, activeButton, setActiveButton }: KeepSidebarProps) => {
  return (
    <div className={styles.keepSidebar}>
      {buttonList.map(button => (
        <button
          key={button}
          className={`${styles.keepSidebarButton} ${activeButton === button ? styles.active : ''}`}
          onClick={() => setActiveButton(button)}
        >
          {button}
        </button>
      ))}
    </div>
  )
}

export default KeepSidebar
