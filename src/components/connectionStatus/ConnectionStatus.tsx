import styles from './connectionStatus.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { useIsConnected, useIsReconnecting, useReconnectAttempts } from '@/stores/socketStore'
import { useSocketReconnect } from '@/hooks/useSocketReconnect'

const ConnectionStatus = () => {
  const isConnected = useIsConnected()
  const isReconnecting = useIsReconnecting()
  const reconnectAttempts = useReconnectAttempts()
  const { attemptReconnect } = useSocketReconnect()

  // 연결 상태에 따른 아이콘과 텍스트
  const getStatusInfo = () => {
    if (isConnected) {
      return {
        icon: 'check' as const,
        text: '연결됨',
        className: styles.connected,
      }
    }

    if (isReconnecting) {
      return {
        icon: 'refresh' as const,
        text: `재연결 중... (${reconnectAttempts}/5)`,
        className: styles.reconnecting,
      }
    }

    return {
      icon: 'error' as const,
      text: '연결 끊김',
      className: styles.disconnected,
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className={`${styles.connectionStatus} ${statusInfo.className}`}>
      <SvgIcon name={statusInfo.icon} className={`${styles.icon} ${isReconnecting ? styles.spinning : ''}`} />
      <span className={styles.text}>{statusInfo.text}</span>

      {!isConnected && !isReconnecting && (
        <button onClick={attemptReconnect} className={styles.reconnectButton} disabled={isReconnecting}>
          재연결
        </button>
      )}
    </div>
  )
}

export default ConnectionStatus
