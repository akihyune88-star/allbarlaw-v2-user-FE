import ChatList from '@/container/mypage/myChatList/MyChatList'
import KeepList from '@/container/mypage/keepList/KeepList'
import MypageHeader from '@/container/mypage/mypageHeader/MypageHeader'
import { useState } from 'react'

const TABS = ['keepList', 'chatList']

const Mypage = () => {
  const [tab, setTab] = useState(TABS[0])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleTabClick = (tab: string) => {
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
        onSortChange={handleSortChange}
      />
      <section>{tab === TABS[0] ? <KeepList sortOrder={sortOrder} /> : <ChatList />}</section>
    </div>
  )
}

export default Mypage
