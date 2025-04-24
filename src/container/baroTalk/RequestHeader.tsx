import styles from '@/container/baroTalk/request-header.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface RequestHeaderProps {
  title: string
  mobileTitle: string
  description: string
}

const RequestHeader = ({ title, mobileTitle, description }: RequestHeaderProps) => {
  const isMobile = useMediaQuery('(max-width: 1200px)')

  if (isMobile) {
    return (
      <header className={styles['page-header']}>
        <h1>{mobileTitle}</h1>
        <p>{description}</p>
      </header>
    )
  } else {
    return (
      <header className={styles['page-header']}>
        <h1>{title}</h1>
      </header>
    )
  }
}

export default RequestHeader
