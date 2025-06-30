import SupportHeaderTitle from '@/container/support/supportHeader/SupportHeader'

const NoticeLayout = () => {
  return (
    <div className='w-full'>
      <header className='page-header-layout'>
        <SupportHeaderTitle title='공지사항' />
        {/* <Tabs items={SUB_MENU_LIST} onChange={handleMenuClick} initialPath={'/'} /> */}
      </header>
    </div>
  )
}

export default NoticeLayout
