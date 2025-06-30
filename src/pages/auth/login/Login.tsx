import Tabs from '@/components/tabs/Tabs'
import styles from './login.module.scss'
import { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import SocialLoginButton from '@/container/auth/socialLoginButton/SocialLoginButton'

export const LOGIN_TABS = [
  {
    name: '회원 로그인',
    itemWidth: 84,
    path: '/user',
  },
  {
    name: '변호사 로그인',
    itemWidth: 90,
    path: '/lawyer',
  },
]

const Login = () => {
  const [_activeTab, setActiveTab] = useState('')
  const [activeLocation, setActiveLocation] = useState(false)

  const handleTabChange = (path: string) => {
    setActiveTab(path)
  }

  const handleSaveLocalStorage = () => {
    setActiveLocation(!activeLocation)
  }

  return (
    <div className={styles['login-container']}>
      <header className={styles['login-header']}>
        <h1 className={styles['login-header-title']}>
          {`법률정보 해결사! 올바로 2.0\n회원으로 가입하시고 다양한 법률정보를 찾아보세요.`}
        </h1>
      </header>
      <section className={styles['login-form']}>
        <div className={styles['tabs-container']}>
          <Tabs items={LOGIN_TABS} onChange={handleTabChange} initialPath={'/user'} />
        </div>
        <form className={styles['login-form-content']}>
          <div className={styles['login-form-input-container']}>
            <div className={styles['login-form-input']}>
              <label>아이디</label>
              <input type='text' placeholder='이메일 주소를 입력해주세요' />
            </div>
            <div className={styles['login-form-input']}>
              <label>비밀번호</label>
              <input type='password' placeholder='비밀번호를 입력해주세요' />
            </div>
          </div>
          <div className={styles['login-form-button-container']}>
            <button className={styles['login-form-button']} type='submit'>
              로그인
            </button>
            <div className={styles['login-form-check-container']} onClick={handleSaveLocalStorage}>
              <SvgIcon name='checkRoundLine' size={16} color={activeLocation ? COLOR.green_01 : COLOR.icon_gray_50} />
              <span>로그인 상태 유지</span>
            </div>
          </div>
        </form>
        <div className={styles['auth-action']}>
          <button>아이디 찾기</button>
          <span>|</span>
          <button>비밀번호 찾기</button>
          <span>|</span>
          <button>회원가입</button>
        </div>

        <footer className={styles['login-footer']}>
          <SocialLoginButton />
        </footer>
      </section>
    </div>
  )
}

export default Login
