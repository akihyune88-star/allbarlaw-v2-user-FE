import CategorySelector from '@/container/main/categorySelector/CategorySelector'
import styles from './main.module.scss'

const Main = () => {
  return (
    <div className={styles['main-container']}>
      <CategorySelector title='분류별 법률 정보를 찾아보세요' />
    </div>
  )
}

export default Main
