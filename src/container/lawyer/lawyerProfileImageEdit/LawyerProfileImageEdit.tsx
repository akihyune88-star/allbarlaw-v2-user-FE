import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerProfileImageEdit.module.scss'
import { ProfileImage } from '@/hooks/lawyerAdmin/useProfileImageManager'

interface LawyerProfileImageEditProps {
  profileImages: (ProfileImage | null)[]
  onImageUpload: (file: File, index: number) => Promise<boolean>
  onImageDelete: (index: number) => void
}

const LawyerProfileImageEdit = ({ profileImages, onImageUpload, onImageDelete }: LawyerProfileImageEditProps) => {
  return (
    <section className={styles.formRow}>
      <header className={styles.labelCol}>
        <h3 className={styles.label}>프로필 사진 등록</h3>
      </header>
      <div className={styles.inputCol}>
        <aside className={styles.notice}>
          <p>※ 사진등록시 주의사항</p>
          <ul>
            <li>의뢰인에게 신뢰를 얻을 수 있는 사진을 등록해주세요</li>
            <li>가급적 단독 사진의 상체위주로 촬영후 등록해주시고, 전체 샷은 오히려 잘 안보일 수 있습니다.</li>
            <li>가장 최적의 사진 사이즈는 1,200 x 400이며, 최대 5장까지 등록 가능합니다.</li>
          </ul>
        </aside>
        <div className={styles.imageUploadArea} role='group' aria-label='프로필 사진 업로드'>
          {profileImages.map((file, index) => {
            const isPreviousFilled = index === 0 || profileImages[index - 1] !== null
            const isEnabled = isPreviousFilled && !file

            return (
              <div key={index} className={styles.imageSlot}>
                {file ? (
                  <div className={styles.imageWrapper}>
                    <figure className={styles.imageContainer}>
                      <img src={file.url} alt={`프로필 사진 ${index + 1}`} />
                    </figure>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onImageDelete(index)}
                      type='button'
                      aria-label={`프로필 사진 ${index + 1} 삭제`}
                    >
                      사진삭제
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadWrapper}>
                    <div className={styles.placeholderImage}>
                      <SvgIcon name='human' />
                    </div>
                    <label className={`${styles.uploadButton} ${!isEnabled ? styles.disabled : ''}`}>
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
                      사진등록
                    </label>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LawyerProfileImageEdit
