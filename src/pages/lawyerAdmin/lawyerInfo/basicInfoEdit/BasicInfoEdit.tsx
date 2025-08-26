import styles from './basicInfoEdit.module.scss'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'
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

  const handleSave = () => {
    const validationErrors = validateForm(formData)
    setErrors(validationErrors)

    if (isValid(validationErrors)) {
      // TODO: 저장 API 호출
      console.log('Form Data:', getFormData())
      console.log('Image Data:', getImageData())
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
            <button type='button' className={styles.header__button__cancel} onClick={handleCancel}>
              취소
            </button>
            <button type='button' className={styles.header__button__save} onClick={handleSave}>
              변경완료
            </button>
          </nav>
        </div>
      </HeaderPortal>

      <div className={styles.container}>
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
      </div>
    </>
  )
}

export default BasicInfoEdit
