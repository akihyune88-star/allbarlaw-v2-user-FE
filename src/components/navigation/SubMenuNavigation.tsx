import React, { createContext, useContext, useState, useMemo } from 'react'
import styles from './sub-menu-navigation.module.scss'

type MenuItem = {
  path: string
  name: string
  itemWidth?: number
}

type SubMenuContextType = {
  selectedPath: string
  onSelect: (path: string) => void
}

const SubMenuContext = createContext<SubMenuContextType | null>(null)

const useSubMenuContext = () => {
  const context = useContext(SubMenuContext)
  if (!context) {
    throw new Error('SubMenu.* component must be rendered as child of SubMenu component')
  }
  return context
}

// List Component
const List = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles['menu-navigation-container']}>{children}</div>
}

// Item Component
const Item = ({ path, children, itemWidth }: { path: string; children: React.ReactNode; itemWidth?: number }) => {
  const { selectedPath, onSelect } = useSubMenuContext()
  const isSelected = selectedPath === path

  return (
    <div
      className={`${styles['menu-item']} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(path)}
      style={{ '--item-width': itemWidth ? `${itemWidth}px` : undefined } as React.CSSProperties}
    >
      <span>{children}</span>
    </div>
  )
}

type SubMenuNavigationProps = {
  children?: React.ReactNode
  items?: MenuItem[]
  initialPath?: string
  onChange?: (path: string) => void
}

const SubMenuNavigation = ({ children, items, initialPath, onChange }: SubMenuNavigationProps) => {
  const [selectedPath, setSelectedPath] = useState(initialPath || items?.[0]?.path || '')

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
    <SubMenuContext.Provider value={contextValue}>
      {children || (
        <List>
          {items?.map(item => (
            <Item key={item.path} path={item.path} itemWidth={item.itemWidth}>
              {item.name}
            </Item>
          ))}
        </List>
      )}
    </SubMenuContext.Provider>
  )
}

// Attach sub-components
SubMenuNavigation.List = List
SubMenuNavigation.Item = Item

export default SubMenuNavigation
