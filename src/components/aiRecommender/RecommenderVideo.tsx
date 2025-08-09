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
  description?: string
  isVideoKeep?: boolean
  videoCaseId?: number
  onClick?: () => void
}

const RecommenderVideo = ({
  videoUrl,
  isShowTitle = true,
  title,
  description,
  isVideoKeep,
  videoCaseId,
  onClick,
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
    <section className={styles.container} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {isShowTitle && (
        <header>
          <span>{title}</span>
        </header>
      )}
      <div className={styles['content']}>
        <figure>
          <img src={videoUrl} alt='recommender-video' className={styles.thumbnail} />
        </figure>
        <div className={styles.description}>{description}</div>
        {isLoggedIn && isVideoKeep !== undefined && (
          <button onClick={handleVideoKeep} style={{ backgroundColor: 'transparent', border: 'none' }}>
            <SvgIcon name='bookMark' style={{ flexShrink: 0, fill: isVideoKeep ? COLOR.green_01 : '#fff' }} size={16} />
          </button>
        )}
      </div>
    </section>
  )
}

export default RecommenderVideo
