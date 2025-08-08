import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './lawyer-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useLawyerKeep } from '@/hooks/queries/useLawyer'
import { useEffect, useState } from 'react'
import { copyUrlToClipboard } from '@/utils/clipboard'

type LawyerDetailSidebarProps = {
  lawyerId: number
  lawyerName: string
  lawyerLawfirm: string
  lawyerProfileImage: string[]
  lawyerIsKeep: boolean
}

const LawyerDetailSidebar = ({
  lawyerId,
  lawyerName,
  lawyerLawfirm,
  lawyerProfileImage,
  lawyerIsKeep,
}: LawyerDetailSidebarProps) => {
  const [isKeep, setIsKeep] = useState(lawyerIsKeep)

  useEffect(() => {
    setIsKeep(lawyerIsKeep)
  }, [lawyerIsKeep])

  const { mutate: changeLawyerKeep } = useLawyerKeep({
    onSuccess: data => {
      setIsKeep(data.isKeep)
    },
    onError: () => {
      setIsKeep(prevState => !prevState)
    },
  })

  const saveHandler = () => {
    setIsKeep(prevState => !prevState)
    changeLawyerKeep(lawyerId)
  }

  const shareHandler = () => {
    copyUrlToClipboard()
  }

  return (
    <div className={styles['lawyer-detail-sidebar']}>
      <LawyerVertical
        lawyerId={lawyerId}
        type={2}
        name={lawyerName}
        lawfirm={lawyerLawfirm}
        blogUrl='https://www.naver.com'
        youtubeUrl='https://www.youtube.com'
        instagramUrl='https://www.instagram.com'
        profileImage={lawyerProfileImage}
        className={styles['lawyer-vertical-container']}
        profileImageWidth='100%'
        profileImageHeight='234px'
        saveHandler={saveHandler}
        shareHandler={shareHandler}
        isKeep={isKeep}
        isShare={true}
      />
      <LegalTermWidget
        lagalTermList={[
          '사기죄 [詐欺罪]',
          '업무방해죄 [業務妨害罪]',
          '절도죄 [窃盜罪]',
          '법정대리인 [法定代理人]',
          '위법성 조각사유 [違法性 阻却事由]',
        ]}
      />
    </div>
  )
}

export default LawyerDetailSidebar
