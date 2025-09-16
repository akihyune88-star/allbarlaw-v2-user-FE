import { useState } from 'react'
import KeepSidebar from '../keepSideBar/KeepSidebar'
import styles from './keepList.module.scss'
import MyBlogList from '../myBlogList/MyBlogList'
import MyVideoList from '../myVideoList/MyVideoList'
import MyLegalDictionary from '../myLegalDictionary/MyLegalDictionary'
import MyLawyer from '../myLawyer/MyLawyer'
import MyLegalKnowledgeList from '../myLegalKnowledgeList/MyLegalKnowledgeList'
import { useGetMypageCount } from '@/hooks/queries/useMypage'

const buttonList = ['법률정보의 글', '변호사의 영상', '법률 지식인', '변호사', '법률 사전']

const KeepList = ({ sortOrder, year, month }: { sortOrder: 'asc' | 'desc'; year: number; month: number }) => {
  const [activeButton, setActiveButton] = useState(buttonList[0])

  const { data: mypageCount } = useGetMypageCount({ year, month })

  const renderContent = () => {
    switch (activeButton) {
      case buttonList[0]:
        return <MyBlogList sort={sortOrder} />
      case buttonList[1]:
        return <MyVideoList sort={sortOrder} />
      case buttonList[2]:
        return <MyLegalKnowledgeList sort={sortOrder} />
      case buttonList[3]:
        return <MyLawyer sort={sortOrder} />
      case buttonList[4]:
        return <MyLegalDictionary sort={sortOrder} />
      default:
        return <MyBlogList sort={sortOrder} />
    }
  }

  return (
    <main className={`${styles.keepList} gray-content-container`}>
      <KeepSidebar
        buttonList={buttonList}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        count={mypageCount}
      />
      <section className={styles.keepListContent}>
        <div className={styles.keepListBody}>{renderContent()}</div>
      </section>
    </main>
  )
}

export default KeepList
