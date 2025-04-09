import SvgIcon from './components/SvgIcon'
import viteLogo from '/vite.svg'
import styles from '@/styles/test.module.scss'

const App = () => {
  return (
    <>
      <div className={styles.container}>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <SvgIcon name='loginRound' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <p className='caption3-10'>올바로 2.0 법률 해결사 Allbarlaw</p>
      </div>
      <p className={styles['mobile-only']}>올바로 2.0 법률 해결사 Allbarlaw</p>
    </>
  )
}

export default App
