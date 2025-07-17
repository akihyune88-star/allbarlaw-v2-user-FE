import { useState } from 'react'

export const useAccordion = (
  allowMultiple: boolean = false,
  defaultOpen: string | number | (string | number)[] = []
) => {
  const [openItems, setOpenItems] = useState<Set<string | number>>(
    new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen])
  )

  const toggleItem = (itemId: string | number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)

      if (allowMultiple) {
        if (newSet.has(itemId)) {
          newSet.delete(itemId)
        } else {
          newSet.add(itemId)
        }
      } else {
        newSet.clear()
        newSet.add(itemId)
      }

      return newSet
    })
  }

  const isOpen = (itemId: string | number) => openItems.has(itemId)

  return {
    openItems,
    toggleItem,
    isOpen,
    allowMultiple,
  }
}
