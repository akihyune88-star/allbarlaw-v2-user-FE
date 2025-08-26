import styles from './lawyerBasicInfoForm.module.scss'
import { BasicInfoFormData } from '@/hooks/lawyerAdmin/useBasicInfoForm'

interface LawyerBasicInfoFormProps {
  formData: BasicInfoFormData
  errors: Record<string, string>
  onInputChange: (field: string, value: any) => void
}

const LawyerBasicInfoForm = ({ formData, errors, onInputChange }: LawyerBasicInfoFormProps) => {
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
            style={{ borderColor: errors.lawyerName ? '#ff4d4f' : undefined, width: 340 }}
          />
          <div className={styles.errorWrapper}>
            {errors.lawyerName && <span className={styles.error}>{errors.lawyerName}</span>}
          </div>
        </div>
      </div>

      {/* 생년월일/성별 */}
      <div className={styles.formRow}>
        <div className={styles.labelCol}>
          <label className={styles.label}>생년월일/성별</label>
        </div>
        <div className={styles.inputCol}>
          <div className={styles.flexRow}>
            <select
              className={styles.select}
              value={formData.birthYear || ''}
              onChange={e => onInputChange('birthYear', e.target.value ? Number(e.target.value) : undefined)}
              style={{ borderColor: errors.birthYear ? '#ff4d4f' : undefined }}
            >
              <option value=''>년도</option>
              {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={formData.birthMonth || ''}
              onChange={e => onInputChange('birthMonth', e.target.value ? Number(e.target.value) : undefined)}
              style={{ borderColor: errors.birthMonth ? '#ff4d4f' : undefined }}
            >
              <option value=''>월</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={formData.birthDay || ''}
              onChange={e => onInputChange('birthDay', e.target.value ? Number(e.target.value) : undefined)}
              style={{ borderColor: errors.birthDay ? '#ff4d4f' : undefined }}
            >
              <option value=''>일</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type='radio'
                  value='M'
                  checked={formData.gender === 'M'}
                  onChange={e => onInputChange('gender', e.target.value)}
                />
                남자
              </label>
              <label>
                <input
                  type='radio'
                  value='F'
                  checked={formData.gender === 'F'}
                  onChange={e => onInputChange('gender', e.target.value)}
                />
                여자
              </label>
            </div>
          </div>
          <div className={styles.errorWrapper}>
            {(errors.birthYear || errors.birthMonth || errors.birthDay || errors.gender) && (
              <span className={styles.error}>
                {errors.birthYear || errors.birthMonth || errors.birthDay || errors.gender}
              </span>
            )}
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
          <input
            className={styles.input}
            type='text'
            placeholder='자신있는 분야, 관련 키워드를 입력해주세요. 검색에 노출됩니다 (콤마로 구분)'
            value={formData.tags}
            onChange={e => onInputChange('tags', e.target.value)}
            style={{ borderColor: errors.tags ? '#ff4d4f' : undefined }}
          />
          <div className={styles.errorWrapper}>
            {errors.tags ? (
              <span className={styles.error}>{errors.tags}</span>
            ) : (
              <span className={styles.helperText}>
                2개이상의 태그를 입력해주세요. 콤마를 이용하여 구분할 수 있습니다.
              </span>
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
            <button type='button' className={styles.button}>
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
    </section>
  )
}

export default LawyerBasicInfoForm
