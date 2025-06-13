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
  onSelect: (path: string) => void
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
const List = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles['tabs-container']}>{children}</div>
}

// Item Component
const Item = ({ path, children, itemWidth }: { path: string; children: React.ReactNode; itemWidth?: number }) => {
  const { selectedPath, onSelect } = useTabsContext()
  const isSelected = selectedPath === path

  return (
    <div
      className={`${styles['tab-item']} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(path)}
      style={{ '--item-width': itemWidth ? `${itemWidth}px` : undefined } as React.CSSProperties}
    >
      <span>{children}</span>
    </div>
  )
}

type TabsProps = {
  children?: React.ReactNode
  items?: MenuItem[]
  initialPath?: string
  onChange?: (path: string) => void
}

const Tabs = ({ children, items, initialPath, onChange }: TabsProps) => {
  const location = useLocation()
  const [selectedPath, setSelectedPath] = useState(initialPath || items?.[0]?.path || '')

  // URL이 변경될 때마다 selectedPath 업데이트
  useEffect(() => {
    const pathSegments = location.pathname.split('/')
    const currentPath = pathSegments[pathSegments.length - 1] || '/'

    // 현재 경로가 items의 path와 일치하는지 확인
    const matchingItem = items?.find(item => {
      const itemPath = item.path.replace(/^\//, '') // 앞의 슬래시 제거
      return itemPath === currentPath || (itemPath === '' && currentPath === '')
    })

    if (matchingItem) {
      setSelectedPath(matchingItem.path)
    }
  }, [location.pathname, items])

  const handleSelect = (path: string) => {
    setSelectedPath(path)
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
        <List>
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
