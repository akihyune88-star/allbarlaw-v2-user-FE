import Button from '@/components/button/Button'
import styles from './legal-term-definition.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { useChangeLegalTermKeep } from '@/hooks/queries/useLegalTerm'
import { useEffect, useState } from 'react'
import { COLOR } from '@/styles/color'

interface LegalTermDefinitionProps {
  legalTermId: number
  koreanName: string
  englishName: string
  chineseName: string
  content: string
  source: string
  legalTermKeep: boolean
}

const LegalTermDefinition = ({
  legalTermId,
  koreanName,
  englishName,
  chineseName,
  content,
  source,
  legalTermKeep,
}: LegalTermDefinitionProps) => {
  const [isKeep, setIsKeep] = useState(legalTermKeep)

  useEffect(() => {
    setIsKeep(legalTermKeep)
  }, [legalTermKeep])

  const { mutate: changeLegalTermKeep } = useChangeLegalTermKeep({
    onSuccess: data => {
      setIsKeep(data.isKeep)
    },
    onError: () => {
      console.error('Failed to change legal term keep')
      setIsKeep(prevState => !prevState)
    },
  })

  const handleShare = () => {
    copyUrlToClipboard(window.location.href)
  }

  const handleKeep = () => {
    if (legalTermId) {
      setIsKeep(prev => !prev)
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
            <SvgIcon name='share' size={16} style={{ cursor: 'pointer' }} />
          </Button>
          <Button variant='save' onClick={handleKeep}>
            저장 <SvgIcon name='save' size={16} fill={isKeep ? COLOR.green_01 : 'none'} style={{ cursor: 'pointer' }} />
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default LegalTermDefinition
