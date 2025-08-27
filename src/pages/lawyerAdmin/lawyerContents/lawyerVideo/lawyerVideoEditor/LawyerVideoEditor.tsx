import styles from './lawyerVideoEditor.module.scss'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { ROUTER } from '@/routes/routerConstant'

const LawyerVideoEditor = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    sourceUrl: '',
    videoUrl: '',
    thumbnailUrl: '',
    summaryContent: '',
    tags: [] as string[],
    categoryId: '',
    subcategoryId: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim())
    setFormData(prev => ({
      ...prev,
      tags,
    }))
  }

  const handleSave = () => {
    console.log('Save video:', formData)
    // API 호출 로직 추가
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO_LIST)
  }

  const handleCancel = () => {
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO_LIST)
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.header}>
          <h1 className={styles.header__title}>영상 등록</h1>
          <nav className={styles.header__button}>
            <button type='button' className={styles.header__button__cancel} onClick={handleCancel}>
              취소
            </button>
            <button type='button' className={styles.header__button__save} onClick={handleSave}>
              저장
            </button>
          </nav>
        </div>
      </HeaderPortal>
      
      <section className={styles.container}>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='title' className={styles.label}>
              제목 <span className={styles.required}>*</span>
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder='영상 제목을 입력하세요'
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='sourceUrl' className={styles.label}>
              원본 URL
            </label>
            <input
              type='url'
              id='sourceUrl'
              name='sourceUrl'
              value={formData.sourceUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder='https://youtube.com/watch?v=...'
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='videoUrl' className={styles.label}>
              영상 URL <span className={styles.required}>*</span>
            </label>
            <input
              type='url'
              id='videoUrl'
              name='videoUrl'
              value={formData.videoUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder='영상 임베드 URL을 입력하세요'
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='thumbnailUrl' className={styles.label}>
              썸네일 URL
            </label>
            <input
              type='url'
              id='thumbnailUrl'
              name='thumbnailUrl'
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder='썸네일 이미지 URL을 입력하세요'
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='summaryContent' className={styles.label}>
              요약 내용 <span className={styles.required}>*</span>
            </label>
            <textarea
              id='summaryContent'
              name='summaryContent'
              value={formData.summaryContent}
              onChange={handleChange}
              className={styles.textarea}
              placeholder='영상 요약 내용을 입력하세요'
              rows={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='tags' className={styles.label}>
              태그
            </label>
            <input
              type='text'
              id='tags'
              name='tags'
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className={styles.input}
              placeholder='태그를 쉼표로 구분하여 입력하세요 (예: 상속, 부동산, 계약)'
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor='categoryId' className={styles.label}>
                카테고리
              </label>
              <select
                id='categoryId'
                name='categoryId'
                value={formData.categoryId}
                onChange={handleChange}
                className={styles.select}
              >
                <option value=''>카테고리 선택</option>
                <option value='1'>민사</option>
                <option value='2'>형사</option>
                <option value='3'>가사</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='subcategoryId' className={styles.label}>
                서브카테고리
              </label>
              <select
                id='subcategoryId'
                name='subcategoryId'
                value={formData.subcategoryId}
                onChange={handleChange}
                className={styles.select}
              >
                <option value=''>서브카테고리 선택</option>
                <option value='1'>손해배상</option>
                <option value='2'>계약</option>
                <option value='3'>부동산</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LawyerVideoEditor