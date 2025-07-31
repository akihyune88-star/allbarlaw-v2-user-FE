import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const getAccessToken = () => {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || ''
}

const useUserStatus = (partnerIds: number[]) => {
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>({})
  const statusSocket = useRef<Socket | null>(null)

  useEffect(() => {
    if (partnerIds.length === 0) return

    console.log('🔍 useUserStatus - 상태 소켓 연결 시작, partnerIds:', partnerIds)

    // 글로벌 상태 소켓 연결
    statusSocket.current = io(import.meta.env.VITE_SERVER_API + '/user-status', {
      auth: { token: getAccessToken() },
    })

    console.log('🔍 useUserStatus - 상태 소켓 객체 생성됨:', statusSocket.current.id)

    statusSocket.current.on('connect', () => {
      console.log('✅ useUserStatus 상태 소켓 연결 성공, socketId:', statusSocket.current?.id)

      // 상대방들의 상태 구독
      statusSocket.current?.emit('subscribeToUserStatus', {
        userIds: partnerIds,
      })
      console.log('🔍 useUserStatus - subscribeToUserStatus 발송:', { userIds: partnerIds })
    })

    statusSocket.current.on('connect_error', error => {
      console.log('❌ useUserStatus 상태 소켓 연결 실패:', error.message)
    })

    statusSocket.current.on('disconnect', reason => {
      console.log('❌ useUserStatus 상태 소켓 연결 해제, reason:', reason)
    })

    // 배치 상태 응답 리스너
    statusSocket.current.on('batchUserStatusResponse', data => {
      console.log('🔍 useUserStatus - 배치 사용자 상태 응답 수신:', data)
      setUserStatuses(data.statuses)
    })

    // 실시간 상태 변경 리스너
    statusSocket.current.on('userStatusChanged', data => {
      console.log('🔍 useUserStatus - 사용자 상태 변경 이벤트 수신:', data)
      setUserStatuses(prev => ({
        ...prev,
        [data.userId]: data.status,
      }))
    })

    statusSocket.current.on('userStatusResponse', data => {
      console.log('🔍 useUserStatus - 단일 사용자 상태 응답 수신:', data)
      setUserStatuses(prev => ({
        ...prev,
        [data.userId]: data.status,
      }))
    })

    // 🔍 모든 상태 소켓 이벤트 로깅
    statusSocket.current.onAny((eventName, ...args) => {
      console.log(`🔍 useUserStatus 상태 소켓 이벤트 수신: ${eventName}`, args)
    })

    return () => {
      console.log('🔍 useUserStatus - 상태 소켓 연결 해제')
      statusSocket.current?.disconnect()
    }
  }, [partnerIds])

  return userStatuses
}

export default useUserStatus
