import { useState, useCallback, useMemo } from 'react'

export const useAgreementCheck = (requiredAgreements: string[] = ['notice']) => {
  const [agreementChecked, setAgreementChecked] = useState<string[]>([])

  const handleCheckboxChange = useCallback((values: string[]) => {
    setAgreementChecked(values)
  }, [])

  const isAgreementValid = useMemo(() => {
    return requiredAgreements.every(agreement => agreementChecked.includes(agreement))
  }, [agreementChecked, requiredAgreements])

  return {
    agreementChecked,
    handleCheckboxChange,
    isAgreementValid,
  }
}
