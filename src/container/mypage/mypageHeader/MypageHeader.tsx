import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import { KeyOfIcon } from '@/types/svg'
import styles from './mypageHeader.module.scss'

interface MypageHeaderProps {
  tabs: string[]
  onTabClick: (tab: string) => void
  currentTab: string
}

const MypageHeader = ({ tabs, onTabClick, currentTab }: MypageHeaderProps) => {
  const getTabInfo = (tab: string): { name: string; icon: KeyOfIcon } => {
    switch (tab) {
      case 'keepList':
        return {
          name: 'Keep',
          icon: 'bookMark',
        }
      case 'chatList':
        return {
          name: '지식인 채팅 목록',
          icon: 'talk',
        }
      default:
        return {
          name: 'Keep',
          icon: 'bookMark',
        }
    }
  }

  return (
    <div className={styles.mypageHeader}>
      <h1>마이페이지</h1>
      <div className={styles.tabWrapper}>
        {tabs.map(tab => {
          const tabInfo = getTabInfo(tab)
          const isActive = currentTab === tab
          return (
            <button
              key={tab}
              onClick={() => onTabClick(tab)}
              className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
            >
              <SvgIcon name={tabInfo.icon} size={16} color={isActive ? COLOR.green_01 : COLOR.text_caption} />
              <span>{tabInfo.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MypageHeader
