import { useState } from 'react'
import KeepSidebar from '../keepSideBar/KeepSidebar'
import styles from './keepList.module.scss'

const buttonList = ['법률정보의 글', '변호사의 영상', '법률 지식인', '변호사', '법률 사전']

const KeepList = () => {
  const [activeButton, setActiveButton] = useState(buttonList[0])

  return (
    <main className={`${styles.keepList} gray-content-container`}>
      <KeepSidebar buttonList={buttonList} activeButton={activeButton} setActiveButton={setActiveButton} />
      <section className={styles.keepListContent}>keep</section>
    </main>
  )
}

export default KeepList
