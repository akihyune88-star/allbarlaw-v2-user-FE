import styles from './lawyerProfileImageEdit.module.scss'
import { ProfileImage } from '@/hooks/lawyerAdmin/useProfileImageManager'

interface LawyerProfileImageEditProps {
  profileImages: (ProfileImage | null)[]
  onImageUpload: (file: File, index: number) => Promise<boolean>
  onImageDelete: (index: number) => void
}

const LawyerProfileImageEdit = ({ 
  profileImages, 
  onImageUpload, 
  onImageDelete 
}: LawyerProfileImageEditProps) => {
  return (
    <div className={styles.formRow}>
      <div className={styles.labelCol}>
        <label className={styles.label}>프로필 사진 등록</label>
      </div>
      <div className={styles.inputCol}>
        <div className={styles.notice}>
          <p>※ 사진등록시 주의사항</p>
          <ul>
            <li>의뢰인에게 신뢰를 얻을 수 있는 사진을 등록해주세요</li>
            <li>가급적 단독 사진의 상체위주로 촬영후 등록해주시고, 전체 샷은 오히려 잘 안보일 수 있습니다.</li>
            <li>가장 최적의 사진 사이즈는 1,200 x 400이며, 최대 5장까지 등록 가능합니다.</li>
          </ul>
        </div>
        <div className={styles.imageUploadArea}>
          {profileImages.map((file, index) => {
            const isPreviousFilled = index === 0 || profileImages[index - 1] !== null
            const isEnabled = isPreviousFilled && !file

            return (
              <div key={index} className={styles.imageSlot}>
                {file ? (
                  <>
                    <img src={file.url} alt={`profile-${index}`} />
                    <button 
                      className={styles.deleteIcon} 
                      onClick={() => onImageDelete(index)} 
                      type='button'
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <label className={`${styles.uploadPlaceholder} ${!isEnabled ? styles.disabled : ''}`}>
                    <input
                      type='file'
                      accept='image/jpeg,image/png,image/webp'
                      disabled={!isEnabled}
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          onImageUpload(file, index)
                        }
                      }}
                    />
                    <span>+</span>
                    <span>사진등록</span>
                  </label>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LawyerProfileImageEdit