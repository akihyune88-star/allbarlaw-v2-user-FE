import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'

const Chat = () => {
  return (
    <main className='w-full gray-content-container sub-main-container'>
      <section className='contents-section'>
        <ChatHeader
          id={1}
          isActive={true}
          name={'홍길동'}
          count={{ total: 1256, month: 251 }}
          lawfirm={'example로펌'}
          profileImage='https://picsum.photos/200/300'
          description={`로스쿨 수석!강력사건 전문 해결, 전문 변호사
            오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.`}
        />
      </section>
      <aside className='aside' style={{ backgroundColor: 'blue' }}>
        side
      </aside>
    </main>
  )
}

export default Chat

// <LawyerHorizon
//               onClick={() => handleLawyerDetail(lawyer.toString())}
//               key={lawyer}
//               className={styles['lawyer-list-item']}
//               name={'홍길동'}
//               lawfirm={'example로펌'}
//               profileImage='https://picsum.photos/200/300'
//               description={`로스쿨 수석!강력사건 전문 해결, 전문 변호사
//               오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.
//             `}
