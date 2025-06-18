import React from 'react'
import Divider from '../divider/Divider'
import styles from './contents-recommender.module.scss'
import SvgIcon from '../SvgIcon'

type ContentsRecommenderProps = {
  title: string
  contents: React.ReactNode
  isRefresh?: boolean
  showDivider?: boolean
  dividerPadding?: number
  className?: string
}

const ContentsRecommender = ({
  title,
  contents,
  isRefresh = false,
  showDivider = true,
  dividerPadding = 16,
  className,
}: ContentsRecommenderProps) => {
  return (
    <section className={`${styles.container} ${className}`}>
      <header>
        <h3 className={styles.title}>{title}</h3>
        {isRefresh && <SvgIcon name='refresh' size={16} />}
      </header>
      {showDivider && <Divider padding={dividerPadding} />}
      <div>{contents}</div>
    </section>
  )
}

export default ContentsRecommender
