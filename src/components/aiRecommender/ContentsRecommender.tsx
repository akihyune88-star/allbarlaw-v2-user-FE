import React from 'react'
import Divider from '../divider/Divider'
import styles from './contents-recommender.module.scss'
import SvgIcon from '../SvgIcon'

type ContentsRecommenderProps = {
  title: string
  contents: React.ReactNode
  isRefresh?: boolean
}

const ContentsRecommender = ({ title, contents, isRefresh = false }: ContentsRecommenderProps) => {
  return (
    <section className={styles.container}>
      <header>
        <h3 className={styles.title}>{title}</h3>
        {isRefresh && <SvgIcon name='refresh' size={16} />}
      </header>
      <Divider padding={16} />
      <div>{contents}</div>
    </section>
  )
}

export default ContentsRecommender
