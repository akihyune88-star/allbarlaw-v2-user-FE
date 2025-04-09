import reactLogo from './assets/react.svg'
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
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <p className='caption3-10'>올바로 2.0 법률 해결사 Allbarlaw</p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
