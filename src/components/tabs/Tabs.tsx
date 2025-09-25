import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './tabs.module.scss'

type MenuItem = {
  path: string
  name: string
  itemWidth?: number
}

type TabsContextType = {
  selectedPath: string
  onSelect: (_path: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs.* component must be rendered as child of Tabs component')
  }
  return context
}

// List Component
const List = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`${styles['tabs-container']} ${className}`}>{children}</div>
}

// Item Component
const Item = ({ path, children, itemWidth }: { path: string; children: React.ReactNode; itemWidth?: number }) => {
  const { selectedPath, onSelect } = useTabsContext()
  const isSelected = selectedPath === path

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect(path)
  }

  return (
    <div
      className={`${styles['tab-item']} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      style={{ '--item-width': itemWidth ? `${itemWidth}px` : undefined } as React.CSSProperties}
    >
      <span>{children}</span>
    </div>
  )
}

type TabsProps = {
  children?: React.ReactNode
  items?: MenuItem[]
  className?: string
  initialPath?: string
  selectedPath?: string
  onChange?: (_path: string) => void
  onBeforeChange?: (_path: string) => boolean | void
}

const Tabs = ({ children, items, initialPath, selectedPath: controlledSelectedPath, onChange, onBeforeChange, className }: TabsProps) => {
  const location = useLocation()
  const [internalSelectedPath, setInternalSelectedPath] = useState(initialPath || items?.[0]?.path || '')

  // 제어 컴포넌트 모드와 비제어 모드 처리
  const isControlled = controlledSelectedPath !== undefined
  const selectedPath = isControlled ? controlledSelectedPath : internalSelectedPath

  // URL이 변경될 때마다 selectedPath 업데이트 (비제어 모드에서만)
  useEffect(() => {
    if (!isControlled) {
      const pathname = location.pathname

      // /search 경로인 경우 특별 처리
      if (pathname.startsWith('/search')) {
        const pathSegments = pathname.split('/')
        const searchSubPath = pathSegments.slice(2).join('/') // /search 이후의 경로
        const currentPath = searchSubPath ? `/${searchSubPath}` : '/'

        const matchingItem = items?.find(item => item.path === currentPath)
        if (matchingItem) {
          setInternalSelectedPath(matchingItem.path)
        }
      } else {
        // items의 path가 현재 URL과 정확히 일치하는지 확인
        const matchingItem = items?.find(item => {
          // item.path가 현재 pathname과 일치하거나
          // pathname이 item.path로 시작하는 경우 (하위 라우트)
          return pathname === item.path || pathname.startsWith(item.path + '/')
        })

        if (matchingItem) {
          // 가장 긴 매칭 path 선택 (더 구체적인 경로 우선)
          const longestMatch = items?.filter(item =>
            pathname === item.path || pathname.startsWith(item.path + '/')
          ).sort((a, b) => b.path.length - a.path.length)[0]

          if (longestMatch) {
            setInternalSelectedPath(longestMatch.path)
          }
        }
      }
    }
  }, [location.pathname, items, isControlled])

  const handleSelect = (path: string) => {
    // 현재 선택된 경로와 같으면 무시
    if (path === selectedPath) {
      return
    }

    // onBeforeChange가 있으면 확인
    if (onBeforeChange) {
      const canChange = onBeforeChange(path)
      if (canChange === false) {
        // 변경 취소 - 탭 상태 유지
        return
      }
    }

    // 비제어 모드에서는 내부 상태 업데이트
    if (!isControlled) {
      setInternalSelectedPath(path)
    }

    // 변경 허용
    onChange?.(path)
  }

  const contextValue = useMemo(
    () => ({
      selectedPath,
      onSelect: handleSelect,
    }),
    [selectedPath]
  )

  return (
    <TabsContext.Provider value={contextValue}>
      {children || (
        <List className={className}>
          {items?.map(item => (
            <Item key={item.path} path={item.path} itemWidth={item.itemWidth}>
              {item.name}
            </Item>
          ))}
        </List>
      )}
    </TabsContext.Provider>
  )
}

// Attach sub-components
Tabs.List = List
Tabs.Item = Item

export default Tabs
