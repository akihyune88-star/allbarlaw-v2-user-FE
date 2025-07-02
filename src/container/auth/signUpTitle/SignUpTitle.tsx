import styles from './signUpTitle.module.scss'

const SignUpTitle = ({ title }: { title: string }) => {
  return (
    <div className={styles['sign-up-title']}>
      <h1>{title}</h1>
    </div>
  )
}

export default SignUpTitle
