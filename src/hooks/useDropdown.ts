import { useState, useRef, useEffect } from 'react'

export type DropdownType = 'main' | 'sub' | null

/**
 * 드롭다운 관련 로직을 관리하는 커스텀 훅
 *
 * @returns 드롭다운 상태와 제어 함수들
 */
export const useDropdown = () => {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
  const mainDropdownRef = useRef<HTMLDivElement>(null)
  const subDropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 열기/닫기 토글 함수
  const toggleDropdown = (type: DropdownType) => {
    setOpenDropdown(openDropdown === type ? null : type)
  }

  // 드롭다운 닫기 함수
  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mainDropdownRef.current &&
        !mainDropdownRef.current.contains(event.target as Node) &&
        subDropdownRef.current &&
        !subDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      } else if (
        mainDropdownRef.current &&
        !mainDropdownRef.current.contains(event.target as Node) &&
        openDropdown === 'main'
      ) {
        setOpenDropdown(null)
      } else if (
        subDropdownRef.current &&
        !subDropdownRef.current.contains(event.target as Node) &&
        openDropdown === 'sub'
      ) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  return {
    openDropdown,
    mainDropdownRef,
    subDropdownRef,
    toggleDropdown,
    closeDropdown,
  }
}
