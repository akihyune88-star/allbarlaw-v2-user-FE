import React, { useState, useRef } from 'react'
import styles from './tagInput.module.scss'

type TagInputProps = {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  isLoading?: boolean
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = '키워드를 입력하고 엔터를 누르세요',
  maxTags = 10,
  disabled = false,
  isLoading = false
}) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddTag = (value: string) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) return

    if (tags.length >= maxTags) {
      alert(`최대 ${maxTags}개까지 등록 가능합니다.`)
      return
    }

    if (!tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue])
    }
    setInputValue('')
  }

  const handleRemoveTag = (indexToRemove: number) => {
    if (disabled || isLoading) return
    onChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag(inputValue)
    }
  }

  const getPlaceholder = () => {
    if (isLoading) return 'AI 요약중입니다...'
    return `${placeholder} (${tags.length}/${maxTags})`
  }

  return (
    <div className={styles['tags-container']}>
      <div className={styles['tags-wrapper']}>
        {tags.map((tag, index) => (
          <span key={index} className={styles['tag-item']}>
            #{tag}
            <button
              type='button'
              className={styles['tag-remove']}
              onClick={() => handleRemoveTag(index)}
              aria-label={`${tag} 태그 삭제`}
              disabled={disabled || isLoading}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
          placeholder={getPlaceholder()}
          className={styles['tag-input']}
          disabled={tags.length >= maxTags || disabled || isLoading}
        />
      </div>
    </div>
  )
}

export default TagInput