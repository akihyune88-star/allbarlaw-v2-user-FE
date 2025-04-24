import { useState, useRef, useEffect } from 'react'

export type DropdownType = 'main' | 'sub' | null

interface UseDropdownProps {
  mainCategoryId: number | null
  subCategoryId: number | null
  activeItemClassName: string
}

/**
 * 드롭다운 관련 로직을 관리하는 커스텀 훅
 *
 * @param props 드롭다운 설정 옵션
 * @returns 드롭다운 상태와 제어 함수들
 */
export const useDropdown = ({ mainCategoryId, subCategoryId, activeItemClassName }: UseDropdownProps) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
  const mainDropdownRef = useRef<HTMLDivElement>(null)
  const subDropdownRef = useRef<HTMLDivElement>(null)
  const mainDropdownMenuRef = useRef<HTMLUListElement>(null)
  const subDropdownMenuRef = useRef<HTMLUListElement>(null)

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

  // 드롭다운 메뉴가 열릴 때 선택된 항목으로 스크롤
  useEffect(() => {
    if (openDropdown === 'main' && mainDropdownMenuRef.current && mainCategoryId) {
      const selectedItem = mainDropdownMenuRef.current.querySelector(`.${activeItemClassName}`)
      if (selectedItem) {
        setTimeout(() => {
          selectedItem.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }, 100)
      }
    }
  }, [openDropdown, mainCategoryId, activeItemClassName])

  // 소분류 드롭다운 메뉴가 열릴 때 선택된 항목으로 스크롤
  useEffect(() => {
    if (openDropdown === 'sub' && subDropdownMenuRef.current && subCategoryId) {
      const selectedItem = subDropdownMenuRef.current.querySelector(`.${activeItemClassName}`)
      if (selectedItem) {
        setTimeout(() => {
          selectedItem.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }, 100)
      }
    }
  }, [openDropdown, subCategoryId, activeItemClassName])

  return {
    openDropdown,
    mainDropdownRef,
    subDropdownRef,
    mainDropdownMenuRef,
    subDropdownMenuRef,
    toggleDropdown,
    closeDropdown,
  }
}
