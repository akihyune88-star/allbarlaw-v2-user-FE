import { memo } from 'react'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import SvgIcon from '@/components/SvgIcon'
import styles from '@/container/baroTalk/lawyers-list.module.scss'
import { COLOR } from '@/styles/color'
import { Lawyer } from '@/types/lawyerTypes'

type ListType = 'selected' | 'recommended'

interface LawyersListProps {
  type: ListType
  lawyers: Lawyer[]
  onLawyerClick: (_lawyer: Lawyer) => void
  onRefresh?: () => void
  title?: string
}

const BaroTalkLawyersList = ({ type, lawyers, onLawyerClick, onRefresh, title }: LawyersListProps) => {
  if (type === 'selected' && lawyers.length === 0) return null

  const isSelected = type === 'selected'
  const defaultTitle = isSelected ? '선택된 변호사' : '추천된 변호사'

  return (
    <article className={`${styles['lawyer-selection-box']} ${isSelected ? styles['selected-lawyers'] : ''}`}>
      <header className={styles['lawyer-selection-box-header']}>
        <h3>
          {title || defaultTitle}
          {isSelected && <span>{lawyers.length}</span>}
        </h3>
        {!isSelected && (
          <button onClick={onRefresh}>
            <span>새로고침</span>
            <SvgIcon name='refresh' color={COLOR.green_01} size={16} />
          </button>
        )}
      </header>

      <ul className={styles['lawyer-list']}>
        {lawyers.map(lawyer => (
          <LawyerHorizon
            key={lawyer.lawyerId}
            selected={isSelected}
            className={styles['lawyer-list-item']}
            name={lawyer.lawyerName}
            lawfirm={lawyer.lawfirmName}
            profileImage={lawyer.lawyerProfileImage}
            description={lawyer.lawyerDescription}
            tags={lawyer.tags}
            size='small'
            onClick={() => onLawyerClick(lawyer)}
          />
        ))}
      </ul>
    </article>
  )
}

export default memo(BaroTalkLawyersList)
