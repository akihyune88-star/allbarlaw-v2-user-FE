import DesktopHeader from '@/container/header/components/DesktopHeader'
import styles from '@/container/header/header.module.scss'
import MobileHeader from '@/container/header/components/MobileHeader'

const Header = () => {
  return (
    <div className={styles.container}>
      <DesktopHeader />
      <MobileHeader />
    </div>
  )
}

export default Header
