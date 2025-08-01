const CLIP_STORAGE_KEY = 'lawyer_chat_clips'

interface ClipData {
  chatRoomId: number
  clippedAt: number
}

export const getClippedChatRooms = (): ClipData[] => {
  try {
    const stored = localStorage.getItem(CLIP_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to get clipped chat rooms:', error)
    return []
  }
}

export const toggleClipChatRoom = (chatRoomId: number): boolean => {
  try {
    const clippedRooms = getClippedChatRooms()
    const existingIndex = clippedRooms.findIndex(item => item.chatRoomId === chatRoomId)
    
    if (existingIndex >= 0) {
      clippedRooms.splice(existingIndex, 1)
    } else {
      clippedRooms.push({
        chatRoomId,
        clippedAt: Date.now()
      })
    }
    
    localStorage.setItem(CLIP_STORAGE_KEY, JSON.stringify(clippedRooms))
    return existingIndex < 0
  } catch (error) {
    console.error('Failed to toggle clip chat room:', error)
    return false
  }
}

export const isClippedChatRoom = (chatRoomId: number): boolean => {
  try {
    const clippedRooms = getClippedChatRooms()
    return clippedRooms.some(item => item.chatRoomId === chatRoomId)
  } catch (error) {
    console.error('Failed to check if chat room is clipped:', error)
    return false
  }
}

export const sortChatRoomsByClip = <T extends { chatRoomId: number }>(chatRooms: T[]): T[] => {
  const clippedRooms = getClippedChatRooms()
  const clippedMap = new Map(clippedRooms.map(item => [item.chatRoomId, item.clippedAt]))
  
  return [...chatRooms].sort((a, b) => {
    const aClipped = clippedMap.get(a.chatRoomId)
    const bClipped = clippedMap.get(b.chatRoomId)
    
    if (aClipped && bClipped) {
      return bClipped - aClipped
    }
    
    if (aClipped && !bClipped) return -1
    if (!aClipped && bClipped) return 1
    
    return 0
  })
}