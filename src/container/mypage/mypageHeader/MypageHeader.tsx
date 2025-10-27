import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import { KeyOfIcon } from '@/types/svg'
import styles from './mypageHeader.module.scss'
import { useGetMypageCount } from '@/hooks/queries/useMypage'
import { useState } from 'react'
import { useWithdrawUser } from '@/hooks/queries/useAuth'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import WithdrawModal from '@/components/withdrawModal/WithdrawModal'

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
  const navigate = useNavigate()
  const { data: mypageCount } = useGetMypageCount({ year, month })
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawReason, setWithdrawReason] = useState('')

  const { mutate: withdrawUser, isPending } = useWithdrawUser({
    onSuccess: () => {
      alert('회원 탈퇴가 완료되었습니다.')
      localStorage.removeItem('accessToken')
      navigate(`${ROUTER.AUTH}`)
    },
    onError: (message: string) => {
      alert(message || '탈퇴 처리 중 오류가 발생했습니다.')
    },
  })

  const handleWithdraw = () => {
    withdrawUser({ reason: withdrawReason })
  }

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
    <>
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

          {currentTab === 'accountEdit' ? (
            <div className={styles.sortWrapper}>
              <button onClick={() => setIsWithdrawModalOpen(true)} className={styles.withdrawButton}>
                탈퇴하기
              </button>
            </div>
          ) : (
            onSortChange && (
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
            )
          )}
        </nav>
      </header>
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title='회원 탈퇴하기'
        noticeText={
          <>
            회원 탈퇴를 선택할 경우
            <br />
            즉시 로그아웃 되며, 탈퇴처리가 완료됩니다.
            <br />
            그동안 이용해 주셔서 감사합니다
          </>
        }
        withdrawReason={withdrawReason}
        onReasonChange={setWithdrawReason}
        onConfirm={handleWithdraw}
        isPending={isPending}
      />
    </>
  )
}

export default MypageHeader
