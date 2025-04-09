import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'
import styles from '@/components/header/header.module.scss'

const Header = () => {
  return (
    <div className={styles.container}>
      <DesktopHeader />
      <MobileHeader />
    </div>
  )
}

export default Header
