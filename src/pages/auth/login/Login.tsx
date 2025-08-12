import Tabs from '@/components/tabs/Tabs'
import styles from './login.module.scss'
import { useState, useEffect } from 'react'
import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import SocialLoginButton from '@/container/auth/socialLoginButton/SocialLoginButton'
import { LOGIN_TABS } from '@/constants/authConstants'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData, defaultValues } from './loginSchema'
import LabelInput from '@/components/labelInput/LabelInput'
import { useLogin, useLawyerLogin } from '@/hooks/queries/useLogin'

type AuthActionType = 'ID_FIND' | 'PASSWORD_RESET' | 'SIGNUP'

const Login = () => {
  const [activeTab, setActiveTab] = useState('/user')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [errorMessage])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues,
  })

  const rememberMe = watch('rememberMe')

  const handleTabChange = (path: string) => {
    setActiveTab(path)
  }

  const handleSaveLocalStorage = () => {
    setValue('rememberMe', !rememberMe)
  }

  const { mutate: login, isPending: isLoginPending } = useLogin({
    onSuccess: () => {
      // 일반 사용자 로그인 시 메인 페이지로
      navigate(ROUTER.MAIN)
    },
    onError: message => {
      setErrorMessage(message)
    },
  })

  const { mutate: lawyerLogin, isPending: isLawyerLoginPending } = useLawyerLogin({
    onSuccess: () => {
      // 변호사 로그인 시 관리 페이지로
      navigate(ROUTER.LAWYER_ADMIN)
    },
    onError: message => {
      setErrorMessage(message)
    },
  })

  const handleAuthAction = (type: AuthActionType) => {
    if (type === 'ID_FIND') {
      // 탭에 따라 다른 아이디 찾기 페이지로 이동
      if (activeTab === '/user') {
        navigate(ROUTER.FIND_ID)
      } else {
        navigate(ROUTER.LAWYER_FIND_ID)
      }
    } else if (type === 'PASSWORD_RESET') {
      // 탭에 따라 다른 비밀번호 찾기 페이지로 이동
      if (activeTab === '/user') {
        navigate(ROUTER.RESET_PASSWORD)
      } else {
        navigate(ROUTER.LAWYER_RESET_PASSWORD)
      }
    } else if (type === 'SIGNUP') {
      navigate(ROUTER.SIGNUP)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage('')

    if (activeTab === '/user') {
      // 일반 사용자 로그인
      login({
        userAccount: data.id,
        userPassword: data.password,
        rememberMe: data.rememberMe,
      })
    } else {
      // 변호사 로그인
      lawyerLogin({
        userAccount: data.id,
        userPassword: data.password,
        rememberMe: data.rememberMe,
      })
    }
  }

  const handleSignup = () => {
    if (activeTab === '/user') {
      navigate(ROUTER.SIGNUP)
    } else {
      navigate(ROUTER.LAWYER_SIGNUP_FORM)
    }
  }

  const isPending = isLoginPending || isLawyerLoginPending

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
        <form className={styles['login-form-content']} onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}
          <div className={styles['login-form-input-container']}>
            <LabelInput
              label='아이디'
              placeholder='이메일 주소를 입력해주세요'
              {...register('id')}
              isError={!!errors.id}
              message={errors.id?.message}
            />
            <LabelInput
              label='비밀번호'
              type='password'
              placeholder='비밀번호를 입력해주세요'
              {...register('password')}
              isError={!!errors.password}
              message={errors.password?.message}
            />
          </div>
          <div className={styles['login-form-button-container']}>
            <button className={styles['login-form-button']} type='submit' disabled={isPending}>
              {isPending ? '로그인 중...' : '로그인'}
            </button>
            <div className={styles['login-form-check-container']} onClick={handleSaveLocalStorage}>
              <SvgIcon name='checkRoundLine' size={16} color={rememberMe ? COLOR.green_01 : COLOR.icon_gray_50} />
              <span>로그인 상태 유지</span>
              <input type='checkbox' {...register('rememberMe')} style={{ display: 'none' }} />
            </div>
          </div>
        </form>
        <div className={styles['auth-action']}>
          <button onClick={() => handleAuthAction('ID_FIND')}>아이디 찾기</button>
          <span>|</span>
          <button onClick={() => handleAuthAction('PASSWORD_RESET')}>비밀번호 찾기</button>
          <span>|</span>
          <button onClick={handleSignup}>회원가입</button>
        </div>

        <footer className={styles['login-footer']}>
          {activeTab === '/user' ? (
            <SocialLoginButton type='icon' />
          ) : (
            <button className={styles['lawyer-footer-button']}>변호사 가입 안내</button>
          )}
        </footer>
      </section>
    </div>
  )
}

export default Login
