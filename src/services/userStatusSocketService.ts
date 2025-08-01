import { io, Socket } from 'socket.io-client'

interface UserStatusSubscriber {
  callback: (_statuses: Record<number, string>) => void
  userIds: number[]
}

class UserStatusSocketService {
  private static instance: UserStatusSocketService
  private socket: Socket | null = null
  private subscribers = new Map<string, UserStatusSubscriber>()
  private isConnecting = false

  static getInstance(): UserStatusSocketService {
    if (!this.instance) {
      this.instance = new UserStatusSocketService()
    }
    return this.instance
  }

  private getAccessToken(): string {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || ''
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      if (this.isConnecting) {
        const checkConnection = () => {
          if (this.socket?.connected) {
            resolve()
          } else {
            setTimeout(checkConnection, 100)
          }
        }
        checkConnection()
        return
      }

      this.isConnecting = true

      const token = this.getAccessToken()
      if (!token) {
        this.isConnecting = false
        reject(new Error('No access token available'))
        return
      }

      this.socket = io('/user-status', {
        auth: { token },
        transports: ['websocket', 'polling'],
        autoConnect: true,
      })

      this.socket.on('connect', () => {
        console.log('User status socket connected')
        this.isConnecting = false
        resolve()
      })

      this.socket.on('connect_error', error => {
        console.error('User status socket connection failed:', error)
        this.isConnecting = false
        reject(error)
      })

      this.socket.on('error', error => {
        console.error('User status socket error:', error)
      })

      this.socket.on('batchUserStatusResponse', (data: { statuses: Record<number, string> }) => {
        this.subscribers.forEach(subscriber => {
          subscriber.callback(data.statuses)
        })
      })

      this.socket.on('userStatusChanged', (data: { userId: number; status: string; timestamp: Date }) => {
        this.subscribers.forEach(subscriber => {
          subscriber.callback({ [data.userId]: data.status })
        })
      })

      this.socket.on('disconnect', reason => {
        console.log('User status socket disconnected:', reason)
        this.isConnecting = false

        if (reason === 'io server disconnect') {
          this.socket?.connect()
        }
      })
    })
  }

  async subscribe(
    key: string,
    userIds: number[],
    callback: (_statuses: Record<number, string>) => void
  ): Promise<void> {
    if (!userIds.length) return

    try {
      await this.connect()

      this.subscribers.set(key, { callback, userIds })

      if (this.socket?.connected) {
        this.socket.emit('subscribeToUserStatus', { userIds })
      }
    } catch (error) {
      console.error('Failed to subscribe to user status:', error)
    }
  }

  unsubscribe(key: string): void {
    this.subscribers.delete(key)

    if (this.subscribers.size === 0 && this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  disconnect(): void {
    this.socket?.disconnect()
    this.socket = null
    this.subscribers.clear()
    this.isConnecting = false
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export default UserStatusSocketService
