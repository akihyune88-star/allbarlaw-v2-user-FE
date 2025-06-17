import styles from '@/container/baroTalk/request-header.module.scss'

interface RequestHeaderProps {
  title: string
  description?: string
}

const RequestHeader = ({ title, description }: RequestHeaderProps) => {
  return (
    <header className={styles['page-header']}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  )
}

export default RequestHeader
