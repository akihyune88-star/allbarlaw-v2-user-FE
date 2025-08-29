import { BasicInfoFormData } from './useBasicInfoForm'

export const useFormValidation = () => {
  const validateForm = (formData: BasicInfoFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {}

    // 필수 필드 검사
    if (!formData.greeting.trim()) {
      newErrors.greeting = '인사말을 입력해주세요.'
    }

    if (!formData.lawyerName.trim()) {
      newErrors.lawyerName = '변호사 이름을 입력해주세요.'
    }

    if (!formData.birthYear) {
      newErrors.birthYear = '생년을 선택해주세요.'
    }

    if (!formData.birthMonth) {
      newErrors.birthMonth = '생월을 선택해주세요.'
    }

    if (!formData.birthDay) {
      newErrors.birthDay = '생일을 선택해주세요.'
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '휴대폰 번호를 입력해주세요.'
    } else if (!/^010-?\d{3,4}-?\d{4}$/.test(formData.phoneNumber.replace(/-/g, ''))) {
      newErrors.phoneNumber = '올바른 휴대폰 번호 형식이 아닙니다.'
    }

    // 태그 검사 (최소 2개, 최대 4개)
    const tagArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    if (tagArray.length < 1) {
      newErrors.tags = '최소 2개 이상의 태그를 입력해주세요.'
    } else if (tagArray.length > 20) {
      newErrors.tags = '태그는 최대 4개까지 입력 가능합니다.'
    }

    if (!formData.lawfirmName.trim()) {
      newErrors.lawfirmName = '로펌 사무실 이름을 입력해주세요.'
    }

    if (!formData.address.trim()) {
      newErrors.address = '사무실 주소를 입력해주세요.'
    }

    if (!formData.addressDetail.trim()) {
      newErrors.addressDetail = '상세주소를 입력해주세요.'
    }

    if (!formData.officePhone.trim()) {
      newErrors.officePhone = '사무실 연락처를 입력해주세요.'
    }

    // 카테고리 검사 (최소 1개 이상)
    const validCategories = formData.categories.filter(cat => cat.subcategoryId !== null)
    if (validCategories.length === 0) {
      newErrors.categories = '최소 1개 이상의 주요분야를 선택해주세요.'
    }

    return newErrors
  }

  const isValid = (errors: Record<string, string>): boolean => {
    return Object.keys(errors).length === 0
  }

  return {
    validateForm,
    isValid,
  }
}
