import styles from './lawyerBasicInfoForm.module.scss'
import { BasicInfoFormData } from '@/hooks/lawyerAdmin/useBasicInfoForm'
import TagInput from '@/components/tag/TagInput'
import AddressSearchModal from '@/components/addressSearchModal/AddressSearchModal'
import { useAddressSearch } from '@/hooks/useAddressSearch'
import { useState, useEffect, ChangeEvent } from 'react'

interface LawyerBasicInfoFormProps {
  formData: BasicInfoFormData
  errors: Record<string, string>
  onInputChange: (field: string, value: any) => void
}

const LawyerBasicInfoForm = ({ formData, errors, onInputChange }: LawyerBasicInfoFormProps) => {
  const { isOpen, openAddressSearch, closeAddressSearch } = useAddressSearch()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [officePhone, setOfficePhone] = useState('')

  // formData가 변경될 때 로컬 상태 동기화
  useEffect(() => {
    setPhoneNumber(formData.phoneNumber)
  }, [formData.phoneNumber])

  useEffect(() => {
    setOfficePhone(formData.officePhone)
  }, [formData.officePhone])

  const handleAddressComplete = (data: { address: string; zonecode: string }) => {
    onInputChange('address', data.address)
  }

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '')

    // 최대 11자리로 제한
    const limitedNumbers = numbers.slice(0, 11)

    // 빈 문자열이면 그대로 반환
    if (!limitedNumbers) return ''

    // 서울 지역번호 02로 시작하는 경우
    if (limitedNumbers.startsWith('02')) {
      if (limitedNumbers.length <= 2) {
        return limitedNumbers
      } else if (limitedNumbers.length <= 5) {
        return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2)}`
      } else if (limitedNumbers.length === 9) {
        // 02-XXX-XXXX (9자리)
        return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2, 5)}-${limitedNumbers.slice(5, 9)}`
      } else {
        // 02-XXXX-XXXX (10자리)
        return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6, 10)}`
      }
    }

    // 그 외 (휴대폰 010, 지역번호 031 등)
    if (limitedNumbers.length <= 3) {
      return limitedNumbers
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`
    } else if (limitedNumbers.length === 10) {
      // 0XX-XXX-XXXX (10자리)
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6, 10)}`
    } else {
      // 0XX-XXXX-XXXX (11자리)
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // 삭제 동작 감지 (이전 값보다 짧아진 경우)
    if (inputValue.length < phoneNumber.length) {
      // 마지막 문자가 하이픈이면 하이픈 앞의 숫자까지 제거
      if (inputValue.endsWith('-')) {
        const withoutHyphen = inputValue.slice(0, -1)
        setPhoneNumber(withoutHyphen)
        onInputChange('phoneNumber', withoutHyphen)
        return
      }
    }

    const formatted = formatPhoneNumber(inputValue)
    setPhoneNumber(formatted)
    onInputChange('phoneNumber', formatted)
  }

  const handleOfficePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // 삭제 동작 감지 (이전 값보다 짧아진 경우)
    if (inputValue.length < officePhone.length) {
      // 마지막 문자가 하이픈이면 하이픈 앞의 숫자까지 제거
      if (inputValue.endsWith('-')) {
        const withoutHyphen = inputValue.slice(0, -1)
        setOfficePhone(withoutHyphen)
        onInputChange('officePhone', withoutHyphen)
        return
      }
    }

    const formatted = formatPhoneNumber(inputValue)
    setOfficePhone(formatted)
    onInputChange('officePhone', formatted)
  }

  return (
    <section className={styles.formContainer}>
      {/* 인사말 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>
            인사말<sup style={{ color: '#ff4d4f' }}>*</sup>
          </label>
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
          <label className={styles.label}>
            휴대폰 번호<sup style={{ color: '#ff4d4f' }}>*</sup>
          </label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='휴대폰 번호를 입력해주세요'
            value={phoneNumber}
            onChange={handlePhoneChange}
            style={{ borderColor: errors.phoneNumber ? '#ff4d4f' : undefined }}
            maxLength={13}
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
            관련 태그<sup style={{ color: '#ff4d4f' }}>*</sup>
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

      {/* 네이버 블로그 주소 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>네이버 블로그 주소</label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='네이버 블로그 URL을 입력해주세요'
            value={formData.blogUrl}
            onChange={e => onInputChange('blogUrl', e.target.value)}
            style={{ borderColor: errors.blogUrl ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.blogUrl && <span className={styles.error}>{errors.blogUrl}</span>}
          </div>
        </div>
      </div>

      {/* 유튜브 채널 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>유튜브 채널</label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='유튜브 채널 URL을 입력해주세요'
            value={formData.youtubeUrl}
            onChange={e => onInputChange('youtubeUrl', e.target.value)}
            style={{ borderColor: errors.youtubeUrl ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.youtubeUrl && <span className={styles.error}>{errors.youtubeUrl}</span>}
          </div>
        </div>
      </div>

      {/* 인스타그램 주소 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>인스타그램 주소</label>
        </div>
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            type='text'
            placeholder='인스타그램 URL을 입력해주세요'
            value={formData.instagramUrl}
            onChange={e => onInputChange('instagramUrl', e.target.value)}
            style={{ borderColor: errors.instagramUrl ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.instagramUrl && <span className={styles.error}>{errors.instagramUrl}</span>}
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
            disabled={true}
            placeholder='사무실명을 입력해주세요'
            value={formData.lawfirmName}
            onChange={e => onInputChange('lawfirmName', e.target.value)}
            style={{ borderColor: errors.lawfirmName ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            <span className={styles.helperText}>로펌 사무실 이름은 변호사 회원정보에서 수정이 가능합니다.</span>
          </div>
        </div>
      </div>

      {/* 사무실 주소 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>
            사무실 주소<sup style={{ color: '#ff4d4f' }}>*</sup>
          </label>
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
            value={officePhone}
            onChange={handleOfficePhoneChange}
            style={{ borderColor: errors.officePhone ? '#ff4d4f' : undefined }}
            maxLength={13}
            disabled={true}
          />
          <div className={styles.errorWrapper}>
            <span className={styles.helperText}>사무실 연락처는 변호사 회원정보에서 수정이 가능합니다.</span>
          </div>
        </div>
      </div>

      <AddressSearchModal isOpen={isOpen} onClose={closeAddressSearch} onComplete={handleAddressComplete} />
    </section>
  )
}

export default LawyerBasicInfoForm
