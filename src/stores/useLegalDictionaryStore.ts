import { create } from 'zustand'

interface LegalDictionaryState {
  searchValue: string
  selectedConsonant: string | null
  setSearchValue: (_value: string) => void
  setSelectedConsonant: (_consonant: string | null) => void
  clearSearch: () => void
}

export const useLegalDictionaryStore = create<LegalDictionaryState>(set => ({
  searchValue: '',
  selectedConsonant: null,
  setSearchValue: (value: string) => set({ searchValue: value }),
  setSelectedConsonant: (consonant: string | null) => set({ selectedConsonant: consonant }),
  clearSearch: () => set({ searchValue: '', selectedConsonant: null }),
}))