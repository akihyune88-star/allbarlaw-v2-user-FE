import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  searchQuery: string
  setSearchQuery: (_query: string) => void
  clearSearchQuery: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    set => ({
      searchQuery: '',
      
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
        // sessionStorage에도 저장
        sessionStorage.setItem('searchQuery', query)
      },
      
      clearSearchQuery: () => {
        set({ searchQuery: '' })
        sessionStorage.removeItem('searchQuery')
      },
    }),
    {
      name: 'search-storage', // localStorage key
      storage: {
        getItem: name => {
          // sessionStorage 우선, 없으면 localStorage
          const sessionValue = sessionStorage.getItem(name)
          if (sessionValue) return JSON.parse(sessionValue)
          
          const localValue = localStorage.getItem(name)
          return localValue ? JSON.parse(localValue) : null
        },
        setItem: (name, value) => {
          // 두 스토리지 모두에 저장
          const stringValue = JSON.stringify(value)
          sessionStorage.setItem(name, stringValue)
          localStorage.setItem(name, stringValue)
        },
        removeItem: name => {
          sessionStorage.removeItem(name)
          localStorage.removeItem(name)
        },
      },
    }
  )
)

// 초기화 시 sessionStorage 값 우선 로드
const initializeSearchQuery = () => {
  const sessionQuery = sessionStorage.getItem('searchQuery')
  if (sessionQuery) {
    useSearchStore.getState().setSearchQuery(sessionQuery)
  }
}

// 앱 시작 시 초기화
if (typeof window !== 'undefined') {
  initializeSearchQuery()
}