import styles from './basicInfoEdit.module.scss'
import { useLawyerDetailForMe, useLawyerBasicInfoEdit } from '@/hooks/queries/useLawyer'
import { useCategory } from '@/hooks/queries/useCategory'
import { useBasicInfoForm } from '@/hooks/lawyerAdmin/useBasicInfoForm'
import { useProfileImageManager } from '@/hooks/lawyerAdmin/useProfileImageManager'
import { useFormValidation } from '@/hooks/lawyerAdmin/useFormValidation'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import LawyerProfileImageEdit from '@/container/lawyer/lawyerProfileImageEdit/LawyerProfileImageEdit'
import LawyerBasicInfoForm from '@/container/lawyer/lawyerBasicInfoForm/LawyerBasicInfoForm'
import LawyerCategorySelect from '@/container/lawyer/lawyerCategorySelect/LawyerCategorySelect'
import { LawyerBasicInfoEditRequest } from '@/types/lawyerTypes'

const BasicInfoEdit = () => {
  const navigate = useNavigate()
  const { data: lawyerBasicInfo } = useLawyerDetailForMe()
  const { data: categoryList } = useCategory()

  // 커스텀 훅들 사용
  const {
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleAddCategory,
    handleRemoveCategory,
    handleCategoryChange,
    getFormData,
  } = useBasicInfoForm(lawyerBasicInfo, categoryList)

  const { profileImages, handleImageDelete, handleImageUpload, getImageData } = useProfileImageManager(lawyerBasicInfo)

  const { validateForm, isValid } = useFormValidation()

  // mutation hook 사용
  const { mutate: updateBasicInfo, isPending } = useLawyerBasicInfoEdit({
    onSuccess: () => {
      console.log('기본 정보가 성공적으로 수정되었습니다.')

      navigate(ROUTER.LAWYER_ADMIN_LAWYER_DETAIL)
    },
    onError: () => {
      console.log('기본 정보 수정에 실패했습니다. 다시 시도해주세요.')
    },
  })

  const handleSave = () => {
    const validationErrors = validateForm(formData)
    setErrors(validationErrors)

    if (isValid(validationErrors)) {
      const formDataToSubmit = getFormData()
      const imageDataToSubmit = getImageData()

      // API 요청 데이터 생성
      const requestData: LawyerBasicInfoEditRequest = {
        lawyerDescription: formDataToSubmit.greeting,
        lawyerName: formDataToSubmit.lawyerName,
        lawyerBirthYear: Number(formDataToSubmit.birthYear ?? '0'),
        lawyerBirthMonth: Number(formDataToSubmit.birthMonth ?? '0'),
        lawyerBirthDay: Number(formDataToSubmit.birthDay ?? '0'),
        lawyerGender: formDataToSubmit.gender === 'male' ? 1 : 2,
        lawyerPhone: formDataToSubmit.phoneNumber,
        lawyerTags: formDataToSubmit.tags || [],
        lawyerLawfirmName: formDataToSubmit.lawfirmName,
        lawyerLawfirmAddress: formDataToSubmit.address,
        lawyerLawfirmAddressDetail: formDataToSubmit.addressDetail || '',
        lawyerLawfirmContact: formDataToSubmit.greeting,
        lawyerSubcategories: formDataToSubmit.categories.map(cat => ({
          subcategoryId: cat.subcategoryId ?? 0,
          subcategoryName:
            categoryList?.find(category => category.subcategories.find(sub => sub.subcategoryId === cat.subcategoryId))
              ?.categoryName ?? '',
        })),
        lawyerProfileImages: imageDataToSubmit.map((image, index) => ({
          imageUrl: image.imageUrl,
          displayOrder: index + 1,
        })),
      }

      // API 호출
      updateBasicInfo({ lawyerId: lawyerBasicInfo?.lawyerId ?? 0, request: requestData })
    }
  }

  const handleCancel = () => {
    navigate(ROUTER.LAWYER_ADMIN_LAWYER_DETAIL)
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.header}>
          <h1 className={styles.header__title}>기본 정보 수정</h1>
          <nav className={styles.header__button}>
            <button type='button' className={styles.header__button__cancel} onClick={handleCancel} disabled={isPending}>
              취소
            </button>
            <button type='button' className={styles.header__button__save} onClick={handleSave} disabled={isPending}>
              {isPending ? '저장 중...' : '변경완료'}
            </button>
          </nav>
        </div>
      </HeaderPortal>

      <section className={styles.formContainer}>
        <div className={styles.formSection}>
          {/* 프로필 사진 섹션 */}
          <LawyerProfileImageEdit
            profileImages={profileImages}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
          />

          {/* 폼 필드 섹션 */}
          <LawyerBasicInfoForm formData={formData} errors={errors} onInputChange={handleInputChange} />

          {/* 카테고리 선택 섹션 */}
          <LawyerCategorySelect
            categories={formData.categories}
            categoryList={categoryList}
            errors={errors}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>
    </>
  )
}

export default BasicInfoEdit
