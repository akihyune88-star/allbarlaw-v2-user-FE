import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontSizeLevel = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface FontSizeState {
  fontSize: FontSizeLevel
  setFontSize: (size: FontSizeLevel) => void
}

export const useFontSizeStore = create<FontSizeState>()(
  persist(
    set => ({
      fontSize: 'sm',
      setFontSize: (size: FontSizeLevel) => set({ fontSize: size }),
    }),
    {
      name: 'font-size-storage',
    }
  )
)
