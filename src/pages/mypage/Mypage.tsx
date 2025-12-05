import ChatList from '@/container/mypage/myChatList/MyChatList'
import KeepList from '@/container/mypage/keepList/KeepList'
import AccountEdit from '@/container/mypage/accountEdit/AccountEdit'
import LawyerAccountEdit from '@/pages/lawyerAdmin/lawyerAccountEdit/LawyerAccountEdit'
import MypageHeader from '@/container/mypage/mypageHeader/MypageHeader'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTER } from '@/routes/routerConstant'

const TABS = ['keepList', 'chatList', 'accountEdit']

const Mypage = () => {
  const { state } = useLocation()
  const { isLawyer } = useAuth()
  const [tab, setTab] = useState(state?.tab || TABS[0])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const currentDate = new Date()
  const [year, setYear] = useState(currentDate.getFullYear())
  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const navigate = useNavigate()

  const handleTabClick = (tab: string) => {
    if (isLawyer && tab === 'accountEdit') {
      navigate(`${ROUTER.LAWYER_ADMIN_ACCOUNT_EDIT}`)
      return
    }
    setTab(tab)
  }

  const handleSortChange = (sortOrder: 'asc' | 'desc') => {
    setSortOrder(sortOrder)
  }

  return (
    <div>
      <MypageHeader
        tabs={TABS}
        onTabClick={handleTabClick}
        currentTab={tab}
        sortOrder={sortOrder}
        year={year}
        month={month}
        onSortChange={handleSortChange}
      />
      <section>
        {tab === 'keepList' ? (
          <KeepList sortOrder={sortOrder} year={year} month={month} />
        ) : tab === 'chatList' ? (
          <ChatList sort={sortOrder} year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />
        ) : tab === 'accountEdit' ? (
          <AccountEdit />
        ) : null}
      </section>
    </div>
  )
}

export default Mypage
