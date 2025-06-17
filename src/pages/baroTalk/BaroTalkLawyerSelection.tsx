import RequestHeader from '@/container/baroTalk/RequestHeader'
import styles from '@/pages/baroTalk/baro-talk-lawyer-selection.module.scss'
import { Lawyer } from '@/types/lawyerTypes'
import { useCallback, useMemo, useState } from 'react'

import Input from '@/components/input/Input'
import CheckBox from '@/components/checkBox'
import ProgressButton from '@/components/progressButton/ProgressButton'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import BaroTalkLawyersList from '@/container/baroTalk/BaroTalkLawyersList'
import { lawyersMockData, noticeInputMockData } from '@/constants/baroTalkMockData'

const BaroTalkLawyerSelection = () => {
  const navigate = useNavigate()
  const [lawyers, _setLawyers] = useState<Lawyer[]>(lawyersMockData)
  const [selectedLawyers, setSelectedLawyers] = useState<Lawyer[]>([])
  const [agreementChecked, setAgreementChecked] = useState<string[]>([])

  const isMobile = useMediaQuery('(max-width: 80rem)')

  const filteredLawyers = useMemo(
    () => lawyers.filter(lawyer => !selectedLawyers.some(sl => sl.id === lawyer.id)),
    [lawyers, selectedLawyers]
  )

  const handleLawyerClick = useCallback(
    (lawyer: Lawyer) => {
      if (selectedLawyers.some(l => l.id === lawyer.id)) {
        setSelectedLawyers(prev => prev.filter(l => l.id !== lawyer.id))
      } else {
        if (selectedLawyers.length >= 4) {
          alert('최대 4명까지 선택할 수 있습니다.')
          return
        }
        setSelectedLawyers(prev => [...prev, lawyer])
      }
    },
    [selectedLawyers]
  )

  const handleRemoveLawyer = useCallback((lawyer: Lawyer) => {
    setSelectedLawyers(prev => prev.filter(l => l.id !== lawyer.id))
  }, [])

  const handleRefresh = useCallback(() => {
    console.log('새로고침 요청')
  }, [])

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [])

  const handleCheckboxChange = useCallback((values: string[]) => {
    setAgreementChecked(values)
  }, [])

  return (
    <main className='form-container'>
      <RequestHeader
        title='법률 상담하기'
        description={
          isMobile ? `상담을 희망하는 변호사를 선택해주세요.\n변호사는 최대 4명까지 선택할 수 있습니다.` : ''
        }
      />
      <section className={`form-body ${styles['body-gap']}`}>
        {!isMobile && (
          <p className={styles['description-text']}>
            {`상담을 희망하는 변호사를 선택해주세요. 
            변호사는 최대 4명까지 선택할 수 있습니다.`}
          </p>
        )}
        <div className={styles['lawyer-selection-box']}>
          <BaroTalkLawyersList type='selected' lawyers={selectedLawyers} onLawyerClick={handleRemoveLawyer} />
          <BaroTalkLawyersList
            type='recommended'
            lawyers={filteredLawyers}
            onLawyerClick={handleLawyerClick}
            onRefresh={handleRefresh}
          />
          <Input
            title='상담 신청시 필수 안내사항 입니다.'
            className={styles['notice-input']}
            placeholder={noticeInputMockData}
            textAreaStyle={{ fontSize: isMobile ? 12 : 14 }}
            footerChildren={
              <CheckBox
                options={[{ value: 'notice', label: '질문 유의사항을 모두 확인했으며, 동의합니다.' }]}
                name='notice'
                className={styles['notice-checkbox']}
                defaultValues={agreementChecked}
                onChange={handleCheckboxChange}
              />
            }
          />
          <ProgressButton steps={3} currentStep={3} onCancel={handleCancel} onNext={handleCancel} />
        </div>
      </section>
    </main>
  )
}

export default BaroTalkLawyerSelection
