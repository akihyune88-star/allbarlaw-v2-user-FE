import { BasicInfoFormData } from './useBasicInfoForm'

export const useFormValidation = () => {
  const validateForm = (formData: BasicInfoFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {}

    // 인사말 (필수, 최대 200자)
    if (!formData.greeting.trim()) {
      newErrors.greeting = '인사말을 입력해주세요.'
    } else if (formData.greeting.length > 200) {
      newErrors.greeting = '인사말은 200자 이내로 입력해주세요.'
    }

    // 변호사 이름 (필수) - disabled 필드지만 검증
    if (!formData.lawyerName.trim()) {
      newErrors.lawyerName = '변호사 이름을 입력해주세요.'
    }

    // 생년월일 (필수) - disabled 필드지만 검증
    if (!formData.birthYear) {
      newErrors.birthYear = '생년을 선택해주세요.'
    }

    if (!formData.birthMonth) {
      newErrors.birthMonth = '생월을 선택해주세요.'
    }

    if (!formData.birthDay) {
      newErrors.birthDay = '생일을 선택해주세요.'
    }

    // 성별 (선택) - gender가 0('unknown')인 경우도 허용
    // disabled 필드이므로 검증에서 제외하거나 완화

    // 휴대폰 번호 (필수, 형식 검사)
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '휴대폰 번호를 입력해주세요.'
    } else {
      const cleanedPhone = formData.phoneNumber.replace(/-/g, '')
      if (!/^010\d{7,8}$/.test(cleanedPhone)) {
        newErrors.phoneNumber = '올바른 휴대폰 번호를 입력해주세요. (010-0000-0000)'
      }
    }

    // 태그 검사 (최소 2개, 최대 20개) - 필수
    if (formData.tags.length < 2) {
      newErrors.tags = '최소 2개 이상의 태그를 입력해주세요.'
    } else if (formData.tags.length > 20) {
      newErrors.tags = '태그는 최대 20개까지 입력 가능합니다.'
    }

    // 로펌 사무실 이름 (필수)
    if (!formData.lawfirmName.trim()) {
      newErrors.lawfirmName = '로펌 사무실 이름을 입력해주세요.'
    }

    // 사무실 주소 (필수)
    if (!formData.address.trim()) {
      newErrors.address = '사무실 주소를 입력해주세요.'
    }

    // 상세주소 (필수)
    if (!formData.addressDetail.trim()) {
      newErrors.addressDetail = '상세주소를 입력해주세요.'
    }

    // 사무실 연락처 (필수, 형식 검사)
    if (!formData.officePhone.trim()) {
      newErrors.officePhone = '사무실 연락처를 입력해주세요.'
    } else {
      const cleanedOfficePhone = formData.officePhone.replace(/-/g, '')
      if (!/^\d{9,11}$/.test(cleanedOfficePhone)) {
        newErrors.officePhone = '올바른 전화번호를 입력해주세요.'
      }
    }

    // 카테고리 검사 (최소 1개 이상) - 필수
    const validCategories = formData.categories.filter(cat => cat.subcategoryId !== null)
    if (validCategories.length === 0) {
      newErrors.categories = '최소 1개 이상의 주요분야를 선택해주세요.'
    }

    return newErrors
  }

  const isValid = (errors: Record<string, string>): boolean => {
    return Object.keys(errors).length === 0
  }

  // 폼이 유효한지 실시간으로 체크하는 함수
  const isFormComplete = (formData: BasicInfoFormData): boolean => {
    // 모든 필수 필드가 채워졌는지 확인 (gender는 0('unknown')도 허용)
    return !!(
      formData.greeting.trim() &&
      formData.greeting.length <= 200 &&
      formData.lawyerName.trim() &&
      formData.birthYear &&
      formData.birthMonth &&
      formData.birthDay &&
      // gender는 빈 문자열이 아닌 경우 유효 ('unknown'도 포함)
      (formData.gender === 'male' || formData.gender === 'female' || formData.gender === 'unknown') &&
      formData.phoneNumber.trim() &&
      formData.tags.length >= 2 &&
      formData.tags.length <= 20 &&
      formData.lawfirmName.trim() &&
      formData.address.trim() &&
      formData.addressDetail.trim() &&
      formData.officePhone.trim() &&
      formData.categories.filter(cat => cat.subcategoryId !== null).length > 0
    )
  }

  return {
    validateForm,
    isValid,
    isFormComplete,
  }
}
