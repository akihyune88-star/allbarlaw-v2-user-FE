import styles from './lawyerBasicInfoForm.module.scss'
import { BasicInfoFormData } from '@/hooks/lawyerAdmin/useBasicInfoForm'
import TagInput from '@/components/tag/TagInput'
import AddressSearchModal from '@/components/addressSearchModal/AddressSearchModal'
import { useAddressSearch } from '@/hooks/useAddressSearch'

interface LawyerBasicInfoFormProps {
  formData: BasicInfoFormData
  errors: Record<string, string>
  onInputChange: (field: string, value: any) => void
}

const LawyerBasicInfoForm = ({ formData, errors, onInputChange }: LawyerBasicInfoFormProps) => {
  const { isOpen, openAddressSearch, closeAddressSearch } = useAddressSearch()

  const handleAddressComplete = (data: { address: string; zonecode: string }) => {
    onInputChange('address', data.address)
  }

  return (
    <section className={styles.formContainer}>
      {/* 인사말 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>인사말</label>
        </div>
        <div className={styles.inputCol}>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder='의뢰인에게 보여줄 인사말을 최대 200자 이내로 입력해주세요.'
            maxLength={200}
            value={formData.greeting}
            onChange={e => onInputChange('greeting', e.target.value)}
            style={{ borderColor: errors.greeting ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.greeting && <span className={styles.error}>{errors.greeting}</span>}
          </div>
        </div>
      </div>

      {/* 변호사 이름 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>변호사 이름</label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='이름을 입력해주세요'
            value={formData.lawyerName}
            onChange={e => onInputChange('lawyerName', e.target.value)}
            style={{
              borderColor: errors.lawyerName ? '#ff4d4f' : undefined,
              width: 340,
              backgroundColor: '#f5f5f5',
              cursor: 'not-allowed',
            }}
            disabled
          />
          <div className={styles.errorWrapper}>
            {errors.lawyerName && <span className={styles.error}>{errors.lawyerName}</span>}
          </div>
        </div>
      </div>

      {/* 휴대폰 번호 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>휴대폰 번호</label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='휴대폰 번호를 입력해주세요'
            value={formData.phoneNumber}
            onChange={e => onInputChange('phoneNumber', e.target.value)}
            style={{ borderColor: errors.phoneNumber ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
          </div>
        </div>
      </div>

      {/* 관련 태그 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>
            관련 태그
            <br />
            <span className={styles.helperText} style={{ fontSize: 12 }}>
              (최소2개/최대20개)
            </span>
          </label>
        </div>
        <div className={styles.inputCol}>
          <TagInput
            tags={formData.tags}
            onChange={tags => onInputChange('tags', tags)}
            placeholder='자신있는 분야, 관련 키워드를 입력 후 엔터를 눌러주세요'
            maxTags={20}
            disabled={false}
            isLoading={false}
          />
          <div className={styles.errorWrapper}>
            {errors.tags ? (
              <span className={styles.error}>{errors.tags}</span>
            ) : (
              <span className={styles.helperText}>2개이상의 태그를 입력해주세요. 검색에 노출됩니다.</span>
            )}
          </div>
        </div>
      </div>

      {/* 로펌 사무실 이름 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>로펌 사무실 이름</label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='사무실명을 입력해주세요'
            value={formData.lawfirmName}
            onChange={e => onInputChange('lawfirmName', e.target.value)}
            style={{ borderColor: errors.lawfirmName ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.lawfirmName && <span className={styles.error}>{errors.lawfirmName}</span>}
          </div>
        </div>
      </div>

      {/* 사무실 주소 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>사무실 주소</label>
        </div>
        <div className={styles.inputCol}>
          <div className={styles.flexRow}>
            <button type='button' className={styles.button} onClick={openAddressSearch}>
              주소 검색하기
            </button>
            <input
              className={styles.input}
              type='text'
              placeholder='신주소 입력'
              style={{ flex: 1, marginLeft: 8, borderColor: errors.address ? '#ff4d4f' : undefined }}
              value={formData.address}
              onChange={e => onInputChange('address', e.target.value)}
            />
          </div>
          <div className={styles.errorWrapper}>
            {errors.address && <span className={styles.error}>{errors.address}</span>}
          </div>
          <input
            className={styles.input}
            type='text'
            placeholder='상세주소를 모두 입력해 주세요'
            style={{ marginTop: 8, borderColor: errors.addressDetail ? '#ff4d4f' : undefined }}
            value={formData.addressDetail}
            onChange={e => onInputChange('addressDetail', e.target.value)}
          />
          <div className={styles.errorWrapper}>
            {errors.addressDetail && <span className={styles.error}>{errors.addressDetail}</span>}
          </div>
        </div>
      </div>

      {/* 사무실 연락처 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>사무실 연락처</label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='사무실 번호를 입력해주세요'
            value={formData.officePhone}
            onChange={e => onInputChange('officePhone', e.target.value)}
            style={{ borderColor: errors.officePhone ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.officePhone && <span className={styles.error}>{errors.officePhone}</span>}
          </div>
        </div>
      </div>

      <AddressSearchModal isOpen={isOpen} onClose={closeAddressSearch} onComplete={handleAddressComplete} />
    </section>
  )
}

export default LawyerBasicInfoForm
