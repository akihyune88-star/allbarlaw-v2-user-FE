// import styles from './brandIdentity.module.scss'
import BrandColors from './components/BrandColors'
import CoreValues from './components/CoreValues'
import LogoSystem from './components/LogoSystem'

const BrandIdentity = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <CoreValues />
      <LogoSystem />
      <BrandColors />
    </div>
  )
}

export default BrandIdentity
