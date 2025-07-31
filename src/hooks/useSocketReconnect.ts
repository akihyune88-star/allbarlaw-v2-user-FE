import { useEffect, useRef, useCallback } from 'react'
import {
  useSocket,
  useSetSocket,
  useSetConnected,
  useSetReconnecting,
  useSetReconnectAttempts,
  useSetLastDisconnectTime,
  useSetReconnectInterval,
  useIncrementReconnectAttempts,
  useResetReconnectState,
} from '@/stores/socketStore'

interface ReconnectConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

const defaultConfig: ReconnectConfig = {
  maxAttempts: 5,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
}

export const useSocketReconnect = (config: Partial<ReconnectConfig> = {}) => {
  const socket = useSocket()
  const setSocket = useSetSocket()
  const setConnected = useSetConnected()
  const setReconnecting = useSetReconnecting()
  const setReconnectAttempts = useSetReconnectAttempts()
  const setLastDisconnectTime = useSetLastDisconnectTime()
  const setReconnectInterval = useSetReconnectInterval()
  const incrementReconnectAttempts = useIncrementReconnectAttempts()
  const resetReconnectState = useResetReconnectState()

  const mergedConfig = { ...defaultConfig, ...config }
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const calculateDelay = useCallback(
    (attempt: number): number => {
      const delay = mergedConfig.baseDelay * Math.pow(mergedConfig.backoffMultiplier, attempt - 1)
      return Math.min(delay, mergedConfig.maxDelay)
    },
    [mergedConfig]
  )

  const attemptReconnect = useCallback(() => {
    if (!socket) return

    const currentAttempts = 0 // 실제로는 store에서 가져와야 함
    if (currentAttempts >= mergedConfig.maxAttempts) {
      console.log('최대 재연결 시도 횟수에 도달했습니다.')
      resetReconnectState()
      return
    }

    console.log(`재연결 시도 ${currentAttempts + 1}/${mergedConfig.maxAttempts}`)

    // 소켓 재연결 로직
    socket.connect()

    const delay = calculateDelay(currentAttempts + 1)
    reconnectTimeoutRef.current = setTimeout(() => {
      attemptReconnect()
    }, delay)
  }, [socket, mergedConfig, calculateDelay, resetReconnectState])

  useEffect(() => {
    if (!socket) return

    const handleDisconnect = (reason: string) => {
      console.log('소켓 연결 해제:', reason)
      setConnected(false)
      setLastDisconnectTime(Date.now())

      // 자동 재연결이 필요한 경우
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        setReconnecting(true)
        incrementReconnectAttempts()
        attemptReconnect()
      }
    }

    const handleConnect = () => {
      console.log('소켓 재연결 성공')
      setConnected(true)
      setReconnecting(false)
      resetReconnectState()

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }

    const handleConnectError = (error: Error) => {
      console.log('소켓 재연결 실패:', error.message)
      setConnected(false)
    }

    socket.on('disconnect', handleDisconnect)
    socket.on('connect', handleConnect)
    socket.on('connect_error', handleConnectError)

    return () => {
      socket.off('disconnect', handleDisconnect)
      socket.off('connect', handleConnect)
      socket.off('connect_error', handleConnectError)

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [
    socket,
    setConnected,
    setReconnecting,
    setLastDisconnectTime,
    incrementReconnectAttempts,
    resetReconnectState,
    attemptReconnect,
  ])

  return {
    isReconnecting: false, // 실제로는 store에서 가져와야 함
    reconnectAttempts: 0, // 실제로는 store에서 가져와야 함
    attemptReconnect,
  }
}
