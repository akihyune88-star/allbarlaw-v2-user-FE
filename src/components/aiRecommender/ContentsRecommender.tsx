import React from 'react'
import Divider from '../divider/Divider'
import styles from './contents-recommender.module.scss'

type ContentsRecommenderProps = {
  title: string
  contents: React.ReactNode
}

const ContentsRecommender = ({ title, contents }: ContentsRecommenderProps) => {
  return (
    <section className={styles.container}>
      <header>
        <h3 className={styles.title}>{title}</h3>
      </header>
      <Divider padding={16} />
      <div>{contents}</div>
    </section>
  )
}

export default ContentsRecommender
