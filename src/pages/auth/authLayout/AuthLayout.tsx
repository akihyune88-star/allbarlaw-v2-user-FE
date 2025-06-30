import { Outlet } from 'react-router-dom'
import styles from './authLayout.module.scss'

const AuthLayout = () => {
  return (
    <div className={['gray-content-container', styles['auth-layout']].join(' ')}>
      <Outlet />
    </div>
  )
}

export default AuthLayout
