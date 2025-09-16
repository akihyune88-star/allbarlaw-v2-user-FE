import { MypageCountResponse } from '@/types/mypageTypes'
import styles from './keepSidebar.module.scss'

interface KeepSidebarProps {
  buttonList: string[]
  activeButton: string
  setActiveButton: (_button: string) => void
  count: MypageCountResponse
}

const KeepSidebar = ({ buttonList, activeButton, setActiveButton, count }: KeepSidebarProps) => {
  const countList = [
    count?.blogCaseCount || 0,
    count?.videoCaseCount || 0,
    count?.knowledgeCount || 0,
    count?.lawyerCount || 0,
    count?.legalTermCount || 0,
  ]

  return (
    <div className={styles.keepSidebar}>
      {buttonList.map((button, index) => (
        <button
          key={button}
          className={`${styles.keepSidebarButton} ${activeButton === button ? styles.active : ''}`}
          onClick={() => setActiveButton(button)}
        >
          {button}
          <span className={styles.count}>({countList[index].toLocaleString()})</span>
        </button>
      ))}
    </div>
  )
}

export default KeepSidebar
