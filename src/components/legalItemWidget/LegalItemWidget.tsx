import { useState, useMemo } from 'react'
import Divider from '../divider/Divider'
import SvgIcon from '../SvgIcon'
import styles from './legal-item-widget.module.scss'
import { LegalTermItem } from '@/types/legalTermTypes'

interface LegalItemWidgetProps {
  title: string
  legalTermList: LegalTermItem[]
  onRefresh?: () => void
}

const LegalItemWidget = ({ title, legalTermList, onRefresh }: LegalItemWidgetProps) => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)

  // 5개씩 청크로 나누기
  const chunks = useMemo(() => {
    const chunkSize = 5
    const result: LegalTermItem[][] = []
    for (let i = 0; i < legalTermList.length; i += chunkSize) {
      result.push(legalTermList.slice(i, i + chunkSize))
    }
    return result
  }, [legalTermList])

  // 현재 표시할 아이템들
  const displayItems = chunks[currentChunkIndex] || []

  // refresh 버튼 클릭 핸들러
  const handleRefresh = () => {
    // 다음 청크로 이동, 마지막이면 처음으로
    const nextIndex = (currentChunkIndex + 1) % chunks.length
    setCurrentChunkIndex(nextIndex)

    // 원래 onRefresh 콜백이 있으면 실행
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles['header']}>
        <h3 className={styles['title']}>{title}</h3>
        <SvgIcon name='refresh' onClick={handleRefresh} />
      </div>
      <Divider padding={16} />
      <div className={styles['content']}>
        {!legalTermList || legalTermList.length === 0 ? (
          <div className={styles['empty-state']}>
            <p className={styles['empty-text']}>표시할 법률 용어가 없습니다.</p>
          </div>
        ) : (
          <>
            {displayItems.map(item => (
              <div className={styles['item']} key={item.legalTermId}>
                <h4 className={styles['item-title']}>
                  {item.koreanName} [{item.chineseName}]
                </h4>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  )
}

export default LegalItemWidget
