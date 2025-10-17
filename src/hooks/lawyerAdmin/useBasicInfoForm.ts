import { useState, useEffect } from 'react'
import { LawyerBasicInfoEditResponse } from '@/types/lawyerTypes'
import { CategoryList } from '@/types/categoryTypes'

export interface BasicInfoFormData {
  greeting: string
  lawyerName: string
  birthYear: number | undefined
  birthMonth: number | undefined
  birthDay: number | undefined
  gender: string
  phoneNumber: string
  tags: string[]
  lawfirmName: string
  address: string
  addressDetail: string
  officePhone: string
  categories: { categoryId: number; subcategoryId: number | null }[]
}

const initialFormData: BasicInfoFormData = {
  greeting: '',
  lawyerName: '',
  birthYear: undefined,
  birthMonth: undefined,
  birthDay: undefined,
  gender: '',
  phoneNumber: '',
  tags: [],
  lawfirmName: '',
  address: '',
  addressDetail: '',
  officePhone: '',
  categories: [],
}

export const useBasicInfoForm = (
  lawyerBasicInfo: LawyerBasicInfoEditResponse | undefined,
  categoryList: CategoryList | undefined
) => {
  const [formData, setFormData] = useState<BasicInfoFormData>(initialFormData)
  const [initialData, setInitialData] = useState<BasicInfoFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDataInitialized, setIsDataInitialized] = useState(false)

  // 데이터 로드 시 폼 필드 초기화
  useEffect(() => {
    if (lawyerBasicInfo && categoryList && !isDataInitialized) {
      // subcategory ID로 해당하는 category ID 찾기
      const mappedCategories =
        lawyerBasicInfo.lawyerSubcategories?.map((sub: any) => {
          const parentCategory = categoryList.find(cat => cat.subcategories.some(s => s.subcategoryId === sub.subcategoryId))
          return {
            categoryId: parentCategory?.categoryId || 0,
            subcategoryId: sub.subcategoryId || null,
          }
        }) || []

      const loadedData = {
        greeting: lawyerBasicInfo.lawyerDescription || '',
        lawyerName: lawyerBasicInfo.lawyerName || '',
        birthYear: lawyerBasicInfo.lawyerBirthYear || undefined,
        birthMonth: lawyerBasicInfo.lawyerBirthMonth || undefined,
        birthDay: lawyerBasicInfo.lawyerBirthDay || undefined,
        gender: lawyerBasicInfo.lawyerGender === 1 ? 'male' : lawyerBasicInfo.lawyerGender === 2 ? 'female' : lawyerBasicInfo.lawyerGender === 0 ? 'unknown' : '',
        phoneNumber: lawyerBasicInfo.lawyerPhone || '',
        tags: lawyerBasicInfo.lawyerTags?.map(tag => tag.tagName) || [],
        lawfirmName: lawyerBasicInfo.lawyerLawfirmName || '',
        address: lawyerBasicInfo.lawyerLawfirmAddress || '',
        addressDetail: lawyerBasicInfo.lawyerLawfirmAddressDetail || '',
        officePhone: lawyerBasicInfo.lawyerLawfirmContact || '',
        categories: mappedCategories,
      }

      setFormData(loadedData)
      setInitialData(loadedData)
      setIsDataInitialized(true)
    }
  }, [lawyerBasicInfo, categoryList, isDataInitialized])

  // 입력 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 카테고리 추가
  const handleAddCategory = () => {
    if (formData.categories.length >= 20) {
      return
    }
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { categoryId: 0, subcategoryId: null }],
    }))
  }

  // 카테고리 삭제
  const handleRemoveCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }))
  }

  // 카테고리 변경
  const handleCategoryChange = (index: number, field: 'categoryId' | 'subcategoryId', value: number | null) => {
    setFormData(prev => {
      const newCategories = [...prev.categories]
      if (field === 'categoryId') {
        newCategories[index] = { categoryId: value as number, subcategoryId: null }
      } else {
        newCategories[index] = { ...newCategories[index], subcategoryId: value }
      }
      return { ...prev, categories: newCategories }
    })
    // 카테고리 변경 시 에러 메시지 제거
    if (errors.categories) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.categories
        return newErrors
      })
    }
  }

  // 폼 데이터 반환 함수
  const getFormData = () => {
    return {
      ...formData,
      tags: formData.tags, // 이미 배열이므로 그대로 반환
    }
  }

  // 초기 데이터와 현재 데이터 비교 함수
  const hasChanges = (): boolean => {
    // 배열 비교를 위한 헬퍼 함수
    const arraysEqual = (a: any[], b: any[]): boolean => {
      if (a.length !== b.length) return false
      return a.every((val, index) => {
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val) === JSON.stringify(b[index])
        }
        return val === b[index]
      })
    }

    // 카테고리 비교
    const categoriesChanged = !arraysEqual(formData.categories, initialData.categories)

    // 태그 비교
    const tagsChanged = !arraysEqual(formData.tags, initialData.tags)

    // 다른 필드들 비교
    return (
      formData.greeting !== initialData.greeting ||
      formData.lawyerName !== initialData.lawyerName ||
      formData.birthYear !== initialData.birthYear ||
      formData.birthMonth !== initialData.birthMonth ||
      formData.birthDay !== initialData.birthDay ||
      formData.gender !== initialData.gender ||
      formData.phoneNumber !== initialData.phoneNumber ||
      formData.lawfirmName !== initialData.lawfirmName ||
      formData.address !== initialData.address ||
      formData.addressDetail !== initialData.addressDetail ||
      formData.officePhone !== initialData.officePhone ||
      categoriesChanged ||
      tagsChanged
    )
  }

  return {
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleAddCategory,
    handleRemoveCategory,
    handleCategoryChange,
    getFormData,
    hasChanges,
  }
}
