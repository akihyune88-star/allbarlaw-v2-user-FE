import Button from '@/components/button/Button'
import styles from './legal-term-definition.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { useChangeLegalTermKeep } from '@/hooks/queries/useLegalTerm'
import { useEffect, useState } from 'react'

interface LegalTermDefinitionProps {
  legalTermId: number
  koreanName: string
  englishName: string
  chineseName: string
  content: string
  source: string
}

const LegalTermDefinition = ({
  legalTermId,
  koreanName,
  englishName,
  chineseName,
  content,
  source,
}: LegalTermDefinitionProps) => {
  const [isKeep, setIsKeep] = useState()
  useEffect(() => {
    setIsKeep(isKeep)
  }, [isKeep])

  const { mutate: changeLegalTermKeep } = useChangeLegalTermKeep()

  const handleShare = () => {
    copyUrlToClipboard(window.location.href)
  }

  const handleKeep = () => {
    if (legalTermId) {
      changeLegalTermKeep(legalTermId)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles['header']}>
        <h3 className={styles['title']}>
          {koreanName} ({chineseName})
        </h3>
        <p className={styles['english-title']}>{englishName}</p>
      </header>
      <p className={styles['description']}>{content}</p>
      <footer className={styles['footer']}>
        <p className={styles['source']}>{`출처 : ${source}`}</p>
        <div className={styles['button-wrapper']}>
          <Button variant='share' onClick={handleShare}>
            공유
            <SvgIcon name='share' size={16} />
          </Button>
          <Button variant='save' onClick={handleKeep}>
            저장 <SvgIcon name='save' size={16} />
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default LegalTermDefinition
