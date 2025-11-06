import { useAuth } from '@/contexts/AuthContext'
import SvgIcon from '../SvgIcon'
import styles from './recommender-video.module.scss'
import { COLOR } from '@/styles/color'
import { useVideoKeep } from '@/hooks/queries/useGetVideoList'
import React, { useEffect, useState } from 'react'

type RecommenderVideoProps = {
  videoUrl: string
  isShowTitle?: boolean
  title?: string
  showBookmarkButton?: boolean
  description?: string
  isVideoKeep?: boolean
  videoCaseId?: number
  lawyerName?: string
  lawfirmName?: string
  onClick?: () => void
  className?: string
  lawfirmNameBreak?: boolean
  style?: React.CSSProperties
}

const RecommenderVideo = ({
  videoUrl,
  title,
  description,
  isVideoKeep,
  videoCaseId,
  lawyerName,
  lawfirmName,
  className,
  style,
  onClick,
  showBookmarkButton = true,
}: RecommenderVideoProps) => {
  const { isLoggedIn } = useAuth()

  const [_like, setLike] = useState<boolean>(isVideoKeep ?? false)

  useEffect(() => {
    if (isVideoKeep !== undefined) {
      setLike(isVideoKeep)
    }
  }, [isVideoKeep])

  const { mutate: changeVideoKeep } = useVideoKeep({
    onSuccess: data => {
      // 서버 응답으로 최종 상태 확인
      setLike(data.isKeep)
    },
    onError: () => {
      console.error('Failed to change video keep')
      // 에러 발생 시 원래 상태로 롤백
      setLike(prevState => !prevState)
    },
  })

  const handleVideoKeep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (isLoggedIn && videoCaseId) {
      // 낙관적 업데이트: 즉시 UI 변경
      setLike(prevState => !prevState)
      changeVideoKeep(videoCaseId)
    }
  }
  return (
    <section
      className={`${styles.container} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <div className={styles['content']}>
        <figure>
          <img src={videoUrl} alt='recommender-video' className={styles.thumbnail} />
        </figure>
        <div className={styles['text-wrapper']}>
          {title && (
            <header>
              <span className={styles['title']}>{title}</span>
              {showBookmarkButton && (
                <button onClick={handleVideoKeep} className={styles['bookmark-btn']}>
                  <SvgIcon
                    name='bookMark'
                    style={{ flexShrink: 0, fill: _like ? COLOR.green_01 : '#fff', cursor: 'pointer' }}
                    size={20}
                  />
                </button>
              )}
            </header>
          )}
          {description && <span className={styles['description']}>{description}</span>}
          <div className={styles['video-info']}>
            {lawyerName && (
              <div className={styles['lawyer-info']}>
                <span>{lawyerName} 변호사</span>
                <br className={styles['lawfirm-name-break']} />
                {lawfirmName && <span>[{lawfirmName}]</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecommenderVideo
