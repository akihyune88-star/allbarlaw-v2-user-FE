import styles from './keepSidebar.module.scss'

interface KeepSidebarProps {
  buttonList: string[]
  activeButton: string
  setActiveButton: (button: string) => void
}

const KeepSidebar = ({
  buttonList,
  activeButton,
  setActiveButton,
  // 사용하지 않는 props는 _ prefix
  button: _button,
  onTabChange: _onTabChange,
  activeTab: _activeTab,
}: KeepSidebarProps) => {
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
