import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './lawyer-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'

type LawyerDetailSidebarProps = {
  lawyerId: number
  lawyerName: string
  lawyerLawfirm: string
  lawyerProfileImage: string[]
}

const LawyerDetailSidebar = ({ lawyerId, lawyerName, lawyerLawfirm, lawyerProfileImage }: LawyerDetailSidebarProps) => {
  const saveHandler = () => {
    console.log('save')
  }

  const shareHandler = () => {
    console.log('share')
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

const simpleImages: string[] = [
  'https://picsum.photos/800/400?random=1',
  'https://picsum.photos/800/400?random=2',
  'https://picsum.photos/800/400?random=3',
  'https://picsum.photos/800/400?random=4',
]
