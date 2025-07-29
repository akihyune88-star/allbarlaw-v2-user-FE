import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CreateBaroTalkRequest } from '@/types/baroTalkTypes'

// 바로톡 요청 상태 타입
interface BaroTalkState {
  // 요청 데이터
  consultationRequestSubcategoryId?: number
  consultationRequestTitle?: string
  consultationRequestDescription?: string
  selectedLawyerIds?: number[]

  // 액션들
  setSubcategoryId: (subcategoryId: number) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setSelectedLawyerIds: (lawyerIds: number[]) => void

  // 유틸리티 액션들
  reset: () => void
  getCreateBaroTalkRequest: () => CreateBaroTalkRequest | null
  isStep1Complete: () => boolean
  isStep2Complete: () => boolean
  isStep3Complete: () => boolean
}

export const useBaroTalkStore = create<BaroTalkState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      consultationRequestSubcategoryId: undefined,
      consultationRequestTitle: undefined,
      consultationRequestDescription: undefined,
      selectedLawyerIds: undefined,

      // 액션들
      setSubcategoryId: (subcategoryId: number) => set({ consultationRequestSubcategoryId: subcategoryId }),

      setTitle: (title: string) => set({ consultationRequestTitle: title }),

      setDescription: (description: string) => set({ consultationRequestDescription: description }),

      setSelectedLawyerIds: (lawyerIds: number[]) => set({ selectedLawyerIds: lawyerIds }),

      // 유틸리티 액션들
      reset: () =>
        set({
          consultationRequestSubcategoryId: undefined,
          consultationRequestTitle: undefined,
          consultationRequestDescription: undefined,
          selectedLawyerIds: undefined,
        }),

      getCreateBaroTalkRequest: () => {
        const state = get()
        if (
          state.consultationRequestSubcategoryId &&
          state.consultationRequestTitle &&
          state.consultationRequestDescription &&
          state.selectedLawyerIds &&
          state.selectedLawyerIds.length > 0
        ) {
          return {
            consultationRequestSubcategoryId: state.consultationRequestSubcategoryId,
            consultationRequestTitle: state.consultationRequestTitle,
            consultationRequestDescription: state.consultationRequestDescription,
            selectedLawyerIds: state.selectedLawyerIds,
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

      isStep3Complete: () => {
        const state = get()
        return !!(
          state.consultationRequestSubcategoryId &&
          state.consultationRequestTitle &&
          state.consultationRequestDescription &&
          state.selectedLawyerIds &&
          state.selectedLawyerIds.length > 0
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
