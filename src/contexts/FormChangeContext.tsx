import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface FormChangeContextType {
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (value: boolean) => void
  checkAndNavigate: (callback: () => void) => void
  pendingNavigation: (() => void) | null
  setPendingNavigation: (callback: (() => void) | null) => void
}

const FormChangeContext = createContext<FormChangeContextType | undefined>(undefined)

export const useFormChange = () => {
  const context = useContext(FormChangeContext)
  if (!context) {
    throw new Error('useFormChange must be used within FormChangeProvider')
  }
  return context
}

interface FormChangeProviderProps {
  children: ReactNode
}

export const FormChangeProvider = ({ children }: FormChangeProviderProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  const checkAndNavigate = useCallback((callback: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => callback)
    } else {
      callback()
    }
  }, [hasUnsavedChanges])

  return (
    <FormChangeContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        checkAndNavigate,
        pendingNavigation,
        setPendingNavigation
      }}
    >
      {children}
    </FormChangeContext.Provider>
  )
}

export default FormChangeContext