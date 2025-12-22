import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './lawyer-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useLawyerKeep } from '@/hooks/queries/useLawyer'
import { useEffect, useState } from 'react'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { RecommendationLegalTerm } from '@/types/recommendationTypes'
import { useAuth } from '@/contexts/AuthContext'
import ConfirmModal from '@/components/modal/ConfirmModal'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

type LawyerDetailSidebarProps = {
  lawyerId: number
  lawyerName: string
  lawyerLawfirm: string
  lawyerProfileImage: string[]
  lawyerIsKeep: boolean
  recommendationLegalTerm: RecommendationLegalTerm[]
  socialUrls?: { blogUrl?: string; instagramUrl?: string; youtubeUrl?: string }
  isAdmin?: boolean
}

const LawyerDetailSidebar = ({
  lawyerId,
  lawyerName,
  lawyerLawfirm,
  lawyerProfileImage,
  lawyerIsKeep,
  recommendationLegalTerm,
  isAdmin = false,
  socialUrls,
}: LawyerDetailSidebarProps) => {
  const [isKeep, setIsKeep] = useState(lawyerIsKeep)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

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
    // 로그인 체크
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    setIsKeep(prevState => !prevState)
    changeLawyerKeep(lawyerId)
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    navigate(ROUTER.AUTH)
  }

  const shareHandler = () => copyUrlToClipboard()

  return (
    <div className={styles['lawyer-detail-sidebar']}>
      <ConfirmModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
        message='로그인 후 이용할 수 있습니다.'
        confirmText='확인'
        cancelText='취소'
      />

      <LawyerVertical
        lawyerId={lawyerId}
        type={2}
        name={lawyerName}
        lawfirm={lawyerLawfirm}
        blogUrl={socialUrls?.blogUrl}
        youtubeUrl={socialUrls?.youtubeUrl}
        instagramUrl={socialUrls?.instagramUrl}
        profileImage={lawyerProfileImage}
        className={styles['lawyer-vertical-container']}
        profileImageWidth='100%'
        profileImageHeight='234px'
        saveHandler={saveHandler}
        shareHandler={shareHandler}
        isKeep={isKeep}
        isShare={isAdmin ? false : true}
      />
      {recommendationLegalTerm.length > 0 && <LegalTermWidget lagalTermList={recommendationLegalTerm || []} />}
    </div>
  )
}

export default LawyerDetailSidebar
