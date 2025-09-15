import styles from './lawyerVideoEditor.module.scss'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { ROUTER } from '@/routes/routerConstant'
import { useCategory } from '@/hooks/queries/useCategory'
import { useVideoCreate, useGetYoutubeChannelInfo, useGetYoutubeVideoInfo } from '@/hooks/queries/useVideo'
import { useVideoAiSummary } from '@/hooks/queries/useAiSummary'
import { LawyerVideoCreateRequest } from '@/types/videoTypes'
import { getLawyerIdFromToken } from '@/utils/tokenUtils'
import { LOCAL } from '@/constants/local'
import { useToast } from '@/hooks/useToast'
import { useEffect } from 'react'

const LawyerVideoEditor = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const lawyerId = getLawyerIdFromToken(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN) || '')

  const { data: categoryList } = useCategory()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)

  const selectedCategory = categoryList?.find(c => c.categoryId === selectedCategoryId)

  // 폼 데이터 상태 (채널 정보 포함)
  const [formData, setFormData] = useState({
    channelUrl: '', // 유튜브 채널 경로
    videoUrl: '', // 유튜브 영상 경로
    title: '', // 영상 제목
    summaryContent: '', // AI 요약 내용
    tags: '', // 키워드/태그 (콤마로 구분된 문자열)
    thumbnail: '', // 썸네일 URL
    // 채널 정보
    channelName: '',
    subscriberCount: 0,
    handleName: '',
    channelDescription: '',
    channelThumbnail: '',
  })

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [categoryError, setCategoryError] = useState<string>('')
  const [shouldFetchSummary, setShouldFetchSummary] = useState<boolean>(false)

  // 유튜브 URL 정규식
  const youtubeChannelRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/|channel\/|user\/|@)[^\s/]+|youtube\.com\/[^\s/]+)$/
  const youtubeVideoRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}(\S*)$/

  // 유효성 검사 함수
  const validateField = (name: string, value: string | number) => {
    let error = ''
    const stringValue = String(value)

    switch (name) {
      case 'channelUrl':
        if (stringValue && !youtubeChannelRegex.test(stringValue)) {
          error = '올바른 유튜브 채널 URL을 입력해주세요.'
        }
        break
      case 'videoUrl':
        if (!stringValue) {
          error = '유튜브 영상 경로는 필수입니다.'
        } else if (!youtubeVideoRegex.test(stringValue)) {
          error = '올바른 유튜브 영상 URL을 입력해주세요. (예: https://www.youtube.com/watch?v=...)'
        }
        break
      case 'title':
        if (!stringValue) {
          error = '영상 제목은 필수입니다.'
        } else if (stringValue.length < 2) {
          error = '영상 제목은 최소 2자 이상이어야 합니다.'
        } else if (stringValue.length > 100) {
          error = '영상 제목은 100자 이내로 입력해주세요.'
        }
        break
      case 'summaryContent':
        if (!stringValue) {
          error = 'AI 요약 내용은 필수입니다.'
        } else if (stringValue.length < 10) {
          error = '요약 내용은 최소 10자 이상이어야 합니다.'
        }
        break
      case 'tags':
        if (stringValue) {
          const tagArray = stringValue
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag)
          if (tagArray.length > 10) {
            error = '태그는 최대 10개까지만 입력 가능합니다.'
          }
        }
        break
    }

    return error
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // 필드가 수정될 때 실시간 유효성 검사
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }))
  }

  // YouTube 채널 정보 API 호출
  const { mutate: getYoutubeChannelInfo, isPending: isLoadingChannel } = useGetYoutubeChannelInfo({
    onSuccess: data => {
      setFormData(prev => ({
        ...prev,
        channelName: data.channelName,
        subscriberCount: data.subscriberCount,
        handleName: data.handleName,
        channelDescription: data.channelDescription,
        channelThumbnail: data.channelThumbnail,
      }))
    },
    onError: () => {},
  })

  // YouTube 비디오 정보 API 호출
  const { mutate: getYoutubeVideoInfo, isPending: isLoadingVideoInfo } = useGetYoutubeVideoInfo({
    onSuccess: data => {
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        thumbnail: data.thumbnail || prev.thumbnail,
      }))
    },
    onError: () => {
      showToast('유튜브 영상 정보를 가져오는데 실패했습니다.', 'error')
      setShouldFetchSummary(false)
    },
  })

  // AI 요약 API 호출
  const {
    data: videoAiSummary,
    isLoading: isLoadingAiSummary,
    isError: isAiSummaryError,
  } = useVideoAiSummary(
    { url: formData.videoUrl },
    {
      enabled: shouldFetchSummary && !!formData.videoUrl,
    }
  )

  // AI 요약 성공 시 처리
  useEffect(() => {
    if (videoAiSummary && shouldFetchSummary) {
      if (videoAiSummary.text) {
        setFormData(prev => ({
          ...prev,
          summaryContent: videoAiSummary.text,
        }))
      }
      if (videoAiSummary.tags) {
        const tagsWithoutHash = videoAiSummary.tags.map((tag: string) => tag.replace(/^#/, ''))
        setFormData(prev => ({
          ...prev,
          tags: tagsWithoutHash.join(', '),
        }))
      }
      setShouldFetchSummary(false)
      showToast('AI 요약이 완료되었습니다. 내용을 확인하고 필요시 수정해주세요.', 'success')
    }
  }, [videoAiSummary, shouldFetchSummary, showToast])

  // AI 요약 에러 처리
  useEffect(() => {
    if (isAiSummaryError && shouldFetchSummary) {
      showToast('AI 요약에 실패했습니다. 다시 시도해주세요.', 'error')
      setShouldFetchSummary(false)
    }
  }, [isAiSummaryError, shouldFetchSummary, showToast])

  // AI 요약하기 버튼 클릭 시
  const handleAISummary = () => {
    // 유튜브 URL 유효성 검사
    let hasError = false
    const newErrors: Record<string, string> = {}

    // 영상 URL 검사 (필수)
    if (!formData.videoUrl) {
      newErrors.videoUrl = '유튜브 영상 경로를 입력해주세요.'
      hasError = true
    } else if (!youtubeVideoRegex.test(formData.videoUrl)) {
      newErrors.videoUrl = '올바른 유튜브 영상 URL을 입력해주세요.'
      hasError = true
    }

    // 에러가 있으면 중단
    if (hasError) {
      setErrors(newErrors)
      setTouched({ videoUrl: true })
      showToast('유튜브 URL을 확인해주세요.', 'error')
      return
    }

    // 에러 클리어
    setErrors({})

    // 1. YouTube 비디오 정보 가져오기
    getYoutubeVideoInfo({ videoUrl: formData.videoUrl })

    // 2. AI 요약 트리거
    setShouldFetchSummary(true)
  }

  const handleYoutubeChannelInfo = () => getYoutubeChannelInfo({ channelUrl: formData.channelUrl || '' })

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null
    setSelectedCategoryId(value)
    setSelectedSubcategoryId(null) // Reset subcategory when category changes
    if (categoryError) setCategoryError('') // Clear error when category is selected
  }

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null
    setSelectedSubcategoryId(value)
    if (value && categoryError) setCategoryError('') // Clear error when subcategory is selected
  }

  const { mutate: createVideo, isPending } = useVideoCreate({
    onSuccess: () => {
      showToast('영상이 성공적으로 등록되었습니다.', 'success')
      navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO)
    },
    onError: () => {
      showToast('영상 등록에 실패했습니다.', 'error')
    },
  })

  const handleSave = () => {
    // 모든 필드 터치 처리
    const allTouched = {
      channelUrl: true,
      videoUrl: true,
      title: true,
      summaryContent: true,
      tags: true,
    }
    setTouched(allTouched)

    // 모든 필드 유효성 검사
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key] = error
      }
    })

    // 카테고리 검사
    if (!selectedSubcategoryId) {
      setCategoryError('카테고리를 선택해주세요.')
      showToast('카테고리를 선택해주세요.', 'error')
      return
    } else {
      setCategoryError('')
    }

    // 에러가 있으면 저장 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('입력 정보를 확인해주세요.', 'error')
      return
    }

    // API 요청 데이터 생성
    const requestData: LawyerVideoCreateRequest = {
      lawyerId: Number(lawyerId),
      subcategoryId: selectedSubcategoryId,
      title: formData.title,
      source: formData.videoUrl,
      thumbnail: formData.thumbnail || '',
      summaryContent: formData.summaryContent,
      channelName: formData.channelName,
      subscriberCount: formData.subscriberCount || 0,
      handleName: formData.handleName,
      channelThumbnail: formData.channelThumbnail,
      channelDescription: formData.channelDescription,
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag)
        : [],
    }

    createVideo(requestData)
  }

  const handleCancel = () => navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO_LIST)

  return (
    <>
      <HeaderPortal>
        <div className={styles['header-portal']}>
          <h1 className={styles['header-title']}>영상 등록</h1>
          <nav className={styles['header-buttons']}>
            <button type='button' className={styles['header-button-cancel']} onClick={handleCancel}>
              취소
            </button>
            <button type='button' className={styles['header-button-save']} onClick={handleSave} disabled={isPending}>
              {isPending ? '저장 중...' : '저장'}
            </button>
          </nav>
        </div>
      </HeaderPortal>

      <div className={styles['lawyer-video-editor']}>
        <h1 className={styles['video-editor-title']}>영상 등록</h1>
        <section className={styles['video-editor-section']}>
          <div className={styles['video-editor-row-form']}>
            <h2>카테고리</h2>
            <div className={styles['category-container']}>
              <div className={styles['category-select-row']}>
                <select
                  className={`${styles['category-select']} ${categoryError ? styles['error'] : ''}`}
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
                  className={`${styles['category-select']} ${categoryError ? styles['error'] : ''}`}
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
              {categoryError && <span className={styles['category-error-message']}>{categoryError}</span>}
            </div>
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>유튜브 영상 경로</h2>
            <div>
              <input
                type='text'
                name='videoUrl'
                value={formData.videoUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='유튜브 영상 경로를 입력해주세요.'
                className={`${styles['video-editor__input']} ${errors.videoUrl ? styles['error'] : ''}`}
              />

              <span className={styles['error-message']}>{errors.videoUrl || ' '}</span>
            </div>
          </div>
        </section>
        <button
          className={styles['ai-summary__button']}
          onClick={handleAISummary}
          disabled={isLoadingVideoInfo || isLoadingAiSummary}
        >
          {isLoadingVideoInfo || isLoadingAiSummary ? 'AI 요약 중...' : '유튜브 동영상 AI 요약하기'}
        </button>
        <section className={styles['video-editor-section']}>
          <div className={styles['video-editor-row-form']}>
            <h2>유튜브 채널 경로</h2>
            <div>
              <input
                type='text'
                name='channelUrl'
                value={formData.channelUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='유튜브 채널 홈화면 경로를 입력해주세요.'
                className={`${styles['video-editor__input']} ${errors.channelUrl ? styles['error'] : ''}`}
              />
              <span className={styles['error-message']}>{errors.channelUrl || ' '}</span>
              <button
                className={styles['ai-summary__button']}
                onClick={handleYoutubeChannelInfo}
                style={{ marginLeft: 0, marginBottom: 12 }}
                disabled={isLoadingChannel || formData.channelUrl === ''}
              >
                {isLoadingChannel ? '불러오는 중...' : '유튜브 채널정보 불러오기'}
              </button>
              <ul className={styles['video-channel-info']}>
                <li>채널명 : {formData.channelName}</li>
                <li>
                  구독자 수 : {formData.subscriberCount ? `${(formData.subscriberCount / 10000).toFixed(1)}만명` : ''}
                </li>
                <li>핸들 명 : {formData.handleName}</li>
                <li>채널 설명: {formData.channelDescription}</li>
              </ul>
            </div>
          </div>

          <div className={styles['video-editor-row-form']}>
            <h2>영상 제목</h2>
            <div>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='영상 제목을 입력해주세요.'
                className={`${styles['video-editor__input']} ${errors.title ? styles['error'] : ''}`}
              />
              <span className={styles['error-message']}>{errors.title || ' '}</span>
            </div>
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>AI 요약 내용</h2>
            <div>
              <textarea
                name='summaryContent'
                placeholder={`동영상 주소를 입력 후,AI 요약이 완료되면 내용이 입력되어집니다\n변경할 사항이 있다면 직접 변경해주세요`}
                className={`${styles['video-editor__textarea']} ${errors.summaryContent ? styles['error'] : ''}`}
                value={formData.summaryContent}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ height: 240 }}
              />
              <span className={styles['error-message']}>{errors.summaryContent || ' '}</span>
            </div>
          </div>
          <div className={styles['video-editor-row-form']}>
            <h2>{`키워드/태그\n(콤마로 구분)`}</h2>
            <div>
              <input
                type='text'
                name='tags'
                value={formData.tags}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='AI요약과 동시에 키워드/태그가 입력되어 집니다. 최대 10개까지 등록 가능합니다.'
                className={`${styles['video-editor__input']} ${errors.tags ? styles['error'] : ''}`}
              />
              <span className={styles['error-message']}>{errors.tags || ' '}</span>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LawyerVideoEditor
