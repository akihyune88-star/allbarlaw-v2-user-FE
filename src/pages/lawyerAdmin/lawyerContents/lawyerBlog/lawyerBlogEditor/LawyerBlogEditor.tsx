import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import styles from './lawyerBlogEditor.module.scss'
import { useCategory } from '@/hooks/queries/useCategory'
import React, { useState } from 'react'
import { useBlogAiSummary } from '@/hooks/queries/useAiSummary'
import { useLawyerAdminBlogCreate } from '@/hooks/queries/useBlog'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'
import TagInput from '@/components/tag/TagInput'

const LawyerBlogEditor = () => {
  const navigate = useNavigate()
  const { data: categoryList } = useCategory()
  const { data: lawyerDetailForMe } = useLawyerDetailForMe()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)
  const [blogUrl, setBlogUrl] = useState<string>('')
  const [blogTitle, setBlogTitle] = useState<string>('')
  const [blogContent, setBlogContent] = useState<string>('')
  const [blogKeywords, setBlogKeywords] = useState<string[]>([])
  const [shouldFetchSummary, setShouldFetchSummary] = useState<boolean>(false)
  const [thumbnail, setThumbnail] = useState<string>('')

  const selectedCategory = categoryList?.find(c => c.categoryId === selectedCategoryId)
  const selectedSubcategory = selectedCategory?.subcategories?.find(sub => sub.subcategoryId === selectedSubcategoryId)

  const { mutate: createBlog, isPending: isCreatingBlog } = useLawyerAdminBlogCreate()

  const {
    data: blogAiSummary,
    isLoading: isLoadingSummary,
    isError,
  } = useBlogAiSummary(
    {
      url: blogUrl,
      category: selectedSubcategory?.subcategoryName || '',
    },
    {
      enabled: shouldFetchSummary && !!blogUrl && !!selectedSubcategoryId,
    }
  )

  // AI 요약 성공 시 처리
  React.useEffect(() => {
    if (blogAiSummary && shouldFetchSummary) {
      if (blogAiSummary.title) setBlogTitle(blogAiSummary.title)
      if (blogAiSummary.text) setBlogContent(blogAiSummary.text)
      if (blogAiSummary.tags) {
        const tagsWithoutHash = blogAiSummary.tags.map((tag: string) => tag.replace(/^#/, ''))
        setBlogKeywords(tagsWithoutHash)
      }
      if (blogAiSummary.thumbnail) setThumbnail(blogAiSummary.thumbnail)
      setShouldFetchSummary(false)
    }
  }, [blogAiSummary, shouldFetchSummary])

  // AI 요약 에러 처리
  React.useEffect(() => {
    if (isError && shouldFetchSummary) {
      alert('AI 요약에 실패했습니다. 다시 시도해주세요.')
      setShouldFetchSummary(false)
    }
  }, [isError, shouldFetchSummary])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null
    setSelectedCategoryId(value)
    setSelectedSubcategoryId(null) // Reset subcategory when category changes
  }

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null
    setSelectedSubcategoryId(value)
  }

  const handleAiSummary = () => {
    if (!blogUrl) {
      alert('블로그 주소를 입력해주세요.')
      return
    }
    if (!selectedSubcategoryId) {
      alert('카테고리를 선택해주세요.')
      return
    }
    setShouldFetchSummary(true)
  }

  const handleSave = () => {
    // 유효성 검사
    if (!selectedSubcategoryId) {
      alert('카테고리를 선택해주세요.')
      return
    }
    if (!blogUrl) {
      alert('블로그 주소를 입력해주세요.')
      return
    }
    if (!blogTitle) {
      alert('제목을 입력해주세요.')
      return
    }
    if (!blogContent) {
      alert('내용을 입력해주세요.')
      return
    }

    // 태그 배열 사용 (이미 배열 형태)
    const tags = blogKeywords.slice(0, 10) // 최대 10개까지

    // 변호사 ID 확인
    if (!lawyerDetailForMe?.lawyerId) {
      alert('변호사 정보를 불러올 수 없습니다.')
      return
    }

    createBlog(
      {
        lawyerId: lawyerDetailForMe.lawyerId,
        subcategoryId: selectedSubcategoryId,
        source: blogUrl,
        title: blogTitle,
        summaryContent: blogContent,
        tags: tags,
        thumbnail: thumbnail || '',
        originalContentLength: 0,
      },
      {
        onSuccess: () => {
          alert('블로그 글이 성공적으로 등록되었습니다.')
          navigate(ROUTER.LAWYER_ADMIN_CONTENT_BLOG)
        },
        onError: () => {
          alert('블로그 글 등록에 실패했습니다. 다시 시도해주세요.')
        },
      }
    )
  }

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
      navigate(ROUTER.LAWYER_ADMIN_CONTENT_BLOG)
    }
  }

  // 모든 필수 필드가 입력되었는지 확인
  const isFormValid = () => {
    return !!(
      selectedSubcategoryId &&
      blogUrl &&
      blogTitle &&
      blogContent &&
      blogKeywords.length > 0
    )
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles['header-portal']}>
          <h1 className={styles['header-title']}>블로그글 등록</h1>
          <div className={styles['header-buttons']}>
            <button type='button' className={styles['header-button-cancel']} onClick={handleCancel}>
              취소
            </button>
            <button
              type='button'
              className={styles['header-button-save']}
              onClick={handleSave}
              disabled={isCreatingBlog || !isFormValid()}
            >
              {isCreatingBlog ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </HeaderPortal>
      <div className={styles['lawyer-blog-editor']}>
        <h1 className={styles['blog-editor-title']}>블로그글 입력</h1>
        <section className={styles['blog-editor-section']}>
          <div className={styles['blog-editor-row-form']}>
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
          <div className={styles['blog-editor-row-form']}>
            <h2>블로그 주소</h2>
            <input
              type='text'
              value={blogUrl}
              onChange={e => setBlogUrl(e.target.value)}
              placeholder='네이버 블로그 주소를 입력해주세요.'
              className={styles['blog-editor__input']}
              style={{ width: 340 }}
            />
          </div>
        </section>
        <button className={styles['ai-summary__button']} onClick={handleAiSummary} disabled={isLoadingSummary}>
          {isLoadingSummary ? 'AI 요약 중...' : 'AI 요약하기'}
        </button>
        <section className={styles['blog-editor-section']}>
          <div className={styles['blog-editor-row-form']}>
            <h2>제목</h2>
            <input
              type='text'
              value={blogTitle}
              onChange={e => setBlogTitle(e.target.value)}
              placeholder={isLoadingSummary ? 'AI 요약중입니다...' : '제목을 입력해주세요.'}
              className={styles['blog-editor__input']}
              disabled={isLoadingSummary}
            />
          </div>
          <div className={styles['blog-editor-row-form']}>
            <h2>AI 요약 내용</h2>
            <textarea
              placeholder={
                isLoadingSummary
                  ? 'AI 요약중입니다...'
                  : `블로그 주소를 입력 후,AI 요약이 완료되면 내용이 입력되어집니다\n변경할 사항이 있다면 직접 변경해주세요`
              }
              className={styles['blog-editor__textarea']}
              value={blogContent}
              onChange={e => setBlogContent(e.target.value)}
              style={{ height: 240 }}
              disabled={isLoadingSummary}
            />
          </div>
          <div className={styles['blog-editor-row-form']}>
            <h2>{`키워드/태그`}</h2>
            <div style={{ width: '100%', margin: '1rem' }}>
              <TagInput
                tags={blogKeywords}
                onChange={setBlogKeywords}
                placeholder='키워드를 입력하고 엔터를 누르세요'
                maxTags={10}
                disabled={false}
                isLoading={isLoadingSummary}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LawyerBlogEditor
