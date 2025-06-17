import React, { createContext, useContext, ReactNode } from 'react'
import styles from './modal.module.scss'

interface ModalContextType {
  isOpen: boolean
  onClose: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal compound components must be used within Modal')
  }
  return context
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={`${styles.modal} ${className || ''}`}>{children}</div>
      </div>
    </ModalContext.Provider>
  )
}

interface ModalHeaderProps {
  children: ReactNode
  showCloseButton?: boolean
  className?: string
}

const ModalHeader = ({ children, showCloseButton = true, className }: ModalHeaderProps) => {
  const { onClose } = useModalContext()

  return (
    <div className={`${styles.header} ${className || ''}`}>
      <div className={styles.title}>{children}</div>
      {showCloseButton && (
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

const ModalBody = ({ children, className }: ModalBodyProps) => {
  return <div className={`${styles.body} ${className || ''}`}>{children}</div>
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return <div className={`${styles.footer} ${className || ''}`}>{children}</div>
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal
