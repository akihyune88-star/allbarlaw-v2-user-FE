import styles from './lawyerVideoEditor.module.scss'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { ROUTER } from '@/routes/routerConstant'
import { useCategory } from '@/hooks/queries/useCategory'

const LawyerVideoEditor = () => {
  const navigate = useNavigate()

  const { data: categoryList } = useCategory()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)

  const selectedCategory = categoryList?.find(c => c.categoryId === selectedCategoryId)

  const [formData, setFormData] = useState({
    title: '',
    source: '',
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

  // const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const tags = e.target.value.split(',').map(tag => tag.trim())
  //   setFormData(prev => ({
  //     ...prev,
  //     tags,
  //   }))
  // }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null
    setSelectedCategoryId(value)
    setSelectedSubcategoryId(null) // Reset subcategory when category changes
  }

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null
    setSelectedSubcategoryId(value)
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
        <div className={styles['header-portal']}>
          <h1 className={styles['header-title']}>영상 등록</h1>
          <nav className={styles['header-buttons']}>
            <button type='button' className={styles['header-button-cancel']} onClick={handleCancel}>
              취소
            </button>
            <button type='button' className={styles['header-button-save']} onClick={handleSave}>
              저장
            </button>
          </nav>
        </div>
      </HeaderPortal>

      <div className={styles['lawyer-video-editor']}>
        <h1 className={styles['video-editor-title']}>영상 등록</h1>
        <section className={styles['video-editor-section']}>
          <div className={styles['video-editor-row-form']}>
            <h2>카테고리</h2>
            <div className={styles['category-select-wrapper']}>
              <select
                className={styles['category-select']}
                value={selectedCategoryId || ''}
                onChange={handleCategoryChange}
              >
                <option value=''>대분류 선택</option>
                {categoryList?.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              <select
                className={styles['category-select']}
                value={selectedSubcategoryId || ''}
                onChange={handleSubcategoryChange}
                disabled={!selectedCategoryId}
              >
                <option value=''>소분류 선택</option>
                {selectedCategory?.subcategories?.map(sub => (
                  <option key={sub.subcategoryId} value={sub.subcategoryId}>
                    {sub.subcategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>유튜브 채널 경로</h2>
            <input
              type='text'
              value={formData.source}
              onChange={e => handleChange(e)}
              placeholder='유튜브 채널 홈화면 경로를 입력해주세요.'
              className={styles['video-editor__input']}
            />
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>유튜브 영상경로</h2>
            <input
              type='text'
              value={formData.source}
              onChange={e => handleChange(e)}
              placeholder='유튜브 영상 경로를 입력해주세요.'
              className={styles['video-editor__input']}
            />
          </div>
        </section>
        <button className={styles['ai-summary__button']}>유튜브 채널정보 및 동영상 AI 요약하기</button>
        <section className={styles['video-editor-section']}>
          <div className={styles['video-editor-row-form']}>
            <h2>영상 제목</h2>
            <ul className={styles['video-channel-info']}>
              <li>채널명 : </li>
              <li>구독자 수 : </li>
              <li>핸들 명 : </li>
              <li>채널 설명: </li>
            </ul>
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>영상 제목</h2>
            <input
              type='text'
              value={formData.source}
              onChange={e => handleChange(e)}
              placeholder='유튜브 채널 홈화면 경로를 입력해주세요.'
              className={styles['video-editor__input']}
            />
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>AI 요약 내용</h2>
            <textarea
              placeholder={`동영상 주소를 입력 후,AI 요약이 완료되면 내용이 입력되어집니다\n변경할 사항이 있다면 직접 변경해주세요`}
              className={styles['video-editor__textarea']}
              value={formData.summaryContent}
              onChange={e => handleChange(e)}
              style={{ height: 240 }}
            />
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>{`키워드/태그\n(콤마로 구분)`}</h2>
            <input
              type='text'
              value={formData.tags}
              onChange={e => handleChange(e)}
              placeholder='AI요약과 동시에 키워드/태그가 입력되어 집니다. 최대 10개까지 등록 가능합니다.'
              className={styles['video-editor__input']}
            />
          </div>
        </section>
      </div>
    </>
  )
}

export default LawyerVideoEditor
