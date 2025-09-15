import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  searchQuery: string
  searchLawyerId: number | undefined
  setSearchQuery: (_query: string) => void
  setSearchLawyerId: (_lawyerId: number | undefined) => void
  clearSearchQuery: () => void
  clearSearchLawyerId: () => void
  clearAll: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    set => ({
      searchQuery: '',
      searchLawyerId: undefined,

      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
        // sessionStorage에도 저장
        sessionStorage.setItem('searchQuery', query)
      },

      setSearchLawyerId: (lawyerId: number | undefined) => {
        set({ searchLawyerId: lawyerId })
        // sessionStorage에 저장
        if (lawyerId !== undefined) {
          sessionStorage.setItem('searchLawyerId', lawyerId.toString())
        } else {
          sessionStorage.removeItem('searchLawyerId')
        }
      },

      clearSearchQuery: () => {
        set({ searchQuery: '' })
        sessionStorage.removeItem('searchQuery')
      },

      clearSearchLawyerId: () => {
        set({ searchLawyerId: undefined })
        sessionStorage.removeItem('searchLawyerId')
      },

      clearAll: () => {
        set({ searchQuery: '', searchLawyerId: undefined })
        sessionStorage.removeItem('searchQuery')
        sessionStorage.removeItem('searchLawyerId')
      },
    }),
    {
      name: 'search-storage', // sessionStorage key
      storage: {
        getItem: name => {
          // sessionStorage만 사용
          const sessionValue = sessionStorage.getItem(name)
          return sessionValue ? JSON.parse(sessionValue) : null
        },
        setItem: (name, value) => {
          // sessionStorage에만 저장
          const stringValue = JSON.stringify(value)
          sessionStorage.setItem(name, stringValue)
        },
        removeItem: name => {
          sessionStorage.removeItem(name)
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