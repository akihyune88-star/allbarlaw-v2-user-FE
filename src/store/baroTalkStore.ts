import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BaroTalkSessionData } from '@/types/baroTalkTypes'

// 바로톡 요청 상태 타입
interface BaroTalkState {
  // 요청 데이터
  consultationRequestSubcategoryId?: number
  consultationRequestTitle?: string
  consultationRequestDescription?: string

  // 액션들
  setSubcategoryId: (_subcategoryId: number) => void
  setTitle: (_title: string) => void
  setDescription: (_description: string) => void

  // 유틸리티 액션들
  reset: () => void
  getCreateBaroTalkRequest: () => BaroTalkSessionData | null
  isStep1Complete: () => boolean
  isStep2Complete: () => boolean
}

export const useBaroTalkStore = create<BaroTalkState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      consultationRequestSubcategoryId: undefined,
      consultationRequestTitle: undefined,
      consultationRequestDescription: undefined,

      // 액션들
      setSubcategoryId: (subcategoryId: number) => set({ consultationRequestSubcategoryId: subcategoryId }),

      setTitle: (title: string) => set({ consultationRequestTitle: title }),

      setDescription: (description: string) => set({ consultationRequestDescription: description }),

      // 유틸리티 액션들
      reset: () =>
        set({
          consultationRequestSubcategoryId: undefined,
          consultationRequestTitle: undefined,
          consultationRequestDescription: undefined,
        }),

      getCreateBaroTalkRequest: () => {
        const state = get()
        if (
          state.consultationRequestSubcategoryId &&
          state.consultationRequestTitle &&
          state.consultationRequestDescription
        ) {
          return {
            consultationRequestSubcategoryId: state.consultationRequestSubcategoryId,
            consultationRequestTitle: state.consultationRequestTitle,
            consultationRequestDescription: state.consultationRequestDescription,
          }
        }
        return null
      },

      isStep1Complete: () => {
        const state = get()
        return !!state.consultationRequestSubcategoryId
      },

      isStep2Complete: () => {
        const state = get()
        return !!(
          state.consultationRequestSubcategoryId &&
          state.consultationRequestTitle &&
          state.consultationRequestDescription
        )
      },
    }),
    {
      name: 'baro-talk-storage', // 스토리지 키 이름
      storage: {
        getItem: name => {
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: name => {
          sessionStorage.removeItem(name)
        },
      },
    }
  )
)
