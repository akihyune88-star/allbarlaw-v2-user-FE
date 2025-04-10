import DesktopHeader from '@/components/header/components/DesktopHeader'
import styles from '@/components/header/header.module.scss'
import MobileHeader from '@/components/header/components/MobileHeader'

const Header = () => {
  return (
    <div className={styles.container}>
      <DesktopHeader />
      <MobileHeader />
    </div>
  )
}

export default Header
