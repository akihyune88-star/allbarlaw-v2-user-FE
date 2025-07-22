import { useState } from 'react'
import KeepSidebar from '../keepSideBar/KeepSidebar'
import styles from './keepList.module.scss'
import MyBlogList from '../myBlogList/MyBlogList'
import MyVideoList from '../myVideoList/MyVideoList'
import MyLegalDictionary from '../myLegalDictionary/MyLegalDictionary'
import MyLawyer from '../myLawyer/MyLawyer'
import MyLegalKnowledgeList from '../myLegalKnowledgeList/MyLegalKnowledgeList'

const buttonList = ['법률정보의 글', '변호사의 영상', '법률 지식인', '변호사', '법률 사전']

const KeepList = () => {
  const [activeButton, setActiveButton] = useState(buttonList[0])

  const renderContent = () => {
    switch (activeButton) {
      case buttonList[0]:
        return <MyBlogList />
      case buttonList[1]:
        return <MyVideoList />
      case buttonList[2]:
        return <MyLegalKnowledgeList />
      case buttonList[3]:
        return <MyLawyer />
      case buttonList[4]:
        return <MyLegalDictionary />
      default:
        return <MyBlogList />
    }
  }

  return (
    <main className={`${styles.keepList} gray-content-container`}>
      <KeepSidebar buttonList={buttonList} activeButton={activeButton} setActiveButton={setActiveButton} />
      <section className={styles.keepListContent}>
        <div className={styles.keepListBody}>{renderContent()}</div>
      </section>
    </main>
  )
}

export default KeepList
