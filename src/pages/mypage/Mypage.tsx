import ChatList from '@/container/mypage/mypageHeader/chatList/ChatList'
import KeepList from '@/container/mypage/mypageHeader/keepList/KeepList'
import MypageHeader from '@/container/mypage/mypageHeader/MypageHeader'
import { useState } from 'react'

const TABS = ['keepList', 'chatList']

const Mypage = () => {
  const [tab, setTab] = useState(TABS[0])

  const handleTabClick = (tab: string) => {
    setTab(tab)
  }

  return (
    <div>
      <MypageHeader tabs={TABS} onTabClick={handleTabClick} currentTab={tab} />
      <section>{tab === TABS[0] ? <KeepList /> : <ChatList />}</section>
    </div>
  )
}

export default Mypage
