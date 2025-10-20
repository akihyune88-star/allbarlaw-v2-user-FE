import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import { KeyOfIcon } from '@/types/svg'
import styles from './mypageHeader.module.scss'
import { useGetMypageCount } from '@/hooks/queries/useMypage'

interface MypageHeaderProps {
  tabs: string[]
  onTabClick: (_tab: string) => void
  currentTab: string
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (_sortOrder: 'asc' | 'desc') => void
  year: number
  month: number
}

const MypageHeader = ({ tabs, onTabClick, currentTab, sortOrder, onSortChange, year, month }: MypageHeaderProps) => {
  const { data: mypageCount } = useGetMypageCount({ year, month })

  const totalKeepCount = mypageCount
    ? Object.entries(mypageCount)
        .filter(([key]) => key !== 'consultationRequestCount')
        .reduce((sum, [, value]) => sum + ((value as number) || 0), 0)
    : 0

  const getTabInfo = (tab: string): { name: string; icon: KeyOfIcon | null } => {
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
      case 'accountEdit':
        return {
          name: '회원정보/비밀번호 변경',
          icon: null,
        }
      default:
        return {
          name: 'Keep',
          icon: 'bookMark',
        }
    }
  }

  return (
    <header className={styles.mypageHeader}>
      <h1>마이페이지</h1>
      <nav className={styles.navigation}>
        <ul className={styles.tabWrapper}>
          {tabs.map(tab => {
            const tabInfo = getTabInfo(tab)
            const isActive = currentTab === tab
            return (
              <li key={tab}>
                <button
                  onClick={() => onTabClick(tab)}
                  className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {tabInfo.icon && (
                    <SvgIcon name={tabInfo.icon} size={16} color={isActive ? COLOR.green_01 : COLOR.text_caption} />
                  )}
                  <span>{tabInfo.name}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {onSortChange && (
          <div className={styles.sortWrapper}>
            <span>
              전체{' '}
              {currentTab === 'keepList'
                ? totalKeepCount.toLocaleString()
                : mypageCount?.consultationRequestCount.toLocaleString()}
              개
            </span>
            <div className={styles.sortButtonWrapper}>
              <button
                onClick={() => onSortChange('desc')}
                className={`${styles.sortButton} ${sortOrder === 'desc' ? styles.active : ''}`}
              >
                최근 등록순
              </button>
              <button
                onClick={() => onSortChange('asc')}
                className={`${styles.sortButton} ${sortOrder === 'asc' ? styles.active : ''}`}
              >
                과거 등록순
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default MypageHeader
