import Button from '@/components/button/Button'
import styles from './legal-term-definition.module.scss'
import SvgIcon from '@/components/SvgIcon'

interface LegalTermDefinitionProps {
  termId: number
}

const LegalTermDefinition = ({ termId }: LegalTermDefinitionProps) => {
  console.log('legal term id', termId)

  return (
    <div className={styles.container}>
      <header className={styles['header']}>
        <h3 className={styles['title']}>파산선고 (破産宣告)</h3>
        <p className={styles['english-title']}>declaration of bankruptcy</p>
      </header>
      <p className={styles['description']}>
        채무자의 지불불능 혹은 채무초과 등의 파산원인이 발생하여 채무자가 법원에 재산동결을 요청하고, 법원이 이를
        수용하여 채무자의 책임재산으로 파산재단을 구성하여 채권자에게 공평하게 배분하는 채무자 회생 및 파산에 관한 법률
        상의 절차(파산절차)를 개시하는 결정을 내리는 선고를 말한다.
      </p>
      <footer className={styles['footer']}>
        <p className={styles['source']}>{`출처 : 네이버 법률용어사전 > 법문북스 www.lawb.co.kr`}</p>
        <div className={styles['button-wrapper']}>
          <Button variant='share'>
            공유
            <SvgIcon name='share' size={16} />
          </Button>
          <Button variant='save'>
            저장 <SvgIcon name='save' size={16} />
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default LegalTermDefinition
