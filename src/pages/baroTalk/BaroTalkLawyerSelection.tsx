import RequestHeader from '@/container/baroTalk/RequestHeader'
import styles from '@/pages/baroTalk/baro-talk-lawyer-selection.module.scss'
import { Lawyer } from '@/types/lawyerTypes'
import { useCallback, useMemo, useState } from 'react'
import LawyersList from '@/container/baroTalk/LawyersList'
import Input from '@/components/input/Input'
import CheckBox from '@/components/checkBox'
import ProgressButton from '@/components/progressButton/ProgressButton'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'

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
        mobileTitle='채팅상담 신청'
        description={`상담을 희망하는 변호사를 선택해주세요.\n변호사는 최대 4명까지 선택할 수 있습니다.`}
      />
      <section className={`form-body ${styles['body-gap']}`}>
        {!isMobile && (
          <p className={styles['description-text']}>
            {`상담을 희망하는 변호사를 선택해주세요. 
            변호사는 최대 4명까지 선택할 수 있습니다.`}
          </p>
        )}
        <div className={styles['lawyer-selection-box']}>
          <LawyersList type='selected' lawyers={selectedLawyers} onLawyerClick={handleRemoveLawyer} />
          <LawyersList
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

export const lawyersMockData: Lawyer[] = [
  {
    id: 1,
    name: '김준호',
    lawfirm: '태양 법률사무소',
    profileImage: 'https://example.com/profiles/lawyer1.jpg',
    tags: ['형사', '민사', '교통사고'],
    description:
      '서울대학교 법학과를 졸업하고 15년간 형사 전문 변호사로 활동해왔습니다. 특히 교통사고 관련 사건에서 높은 승소율을 자랑합니다.',
  },
  {
    id: 2,
    name: '이수진',
    lawfirm: '정의 법무법인',
    profileImage: 'https://example.com/profiles/lawyer2.jpg',
    tags: ['이혼', '가사', '상속'],
    description:
      '가정법원 전문 변호사로 10년 이상의 경력을 가지고 있습니다. 이혼, 양육권, 상속 등 가족 관련 법률 문제를 전문적으로 다룹니다.',
  },
  {
    id: 3,
    name: '박민준',
    lawfirm: '글로벌 법무법인',
    profileImage: 'https://example.com/profiles/lawyer3.jpg',
    tags: ['기업법', '국제법', '계약'],
    description:
      '하버드 로스쿨 졸업 후 다국적 기업의 법무팀장을 역임했습니다. 국제 계약 및 기업 법률 자문에 전문성을 갖추고 있습니다.',
  },
  {
    id: 4,
    name: '최지은',
    lawfirm: '하늘 법률사무소',
    profileImage: 'https://example.com/profiles/lawyer4.jpg',
    tags: ['부동산', '임대차', '재개발'],
    description: '부동산 전문 변호사로서 재개발, 재건축, 임대차 분쟁 등 다양한 부동산 관련 법률 서비스를 제공합니다.',
  },
  {
    id: 5,
    name: '정도윤',
    lawfirm: '미래 법무법인',
    profileImage: 'https://example.com/profiles/lawyer5.jpg',
    tags: ['특허', '저작권', 'IT'],
    description:
      '전자공학 학사와 법학 석사를 보유한 지식재산권 전문 변호사입니다. IT 기업들의 특허 및 저작권 분쟁을 주로 담당합니다.',
  },
  {
    id: 6,
    name: '한서연',
    lawfirm: '정의로운 법률사무소',
    profileImage: 'https://example.com/profiles/lawyer6.jpg',
    tags: ['노동', '산재', '인사'],
    description:
      '노동법 전문 변호사로 근로자의 권익 보호와 기업의 인사 관련 자문을 제공합니다. 산업재해 소송에서 다수의 승소 경험이 있습니다.',
  },
  {
    id: 7,
    name: '오민석',
    lawfirm: '바른 법무법인',
    profileImage: 'https://example.com/profiles/lawyer7.jpg',
    tags: ['형사', '성범죄', '학교폭력'],
    description:
      '검찰청 근무 경력 10년을 바탕으로 형사 사건, 특히 성범죄와 학교폭력 관련 사건을 전문적으로 변호합니다.',
  },
  {
    id: 8,
    name: '임지현',
    lawfirm: '해피 법률사무소',
    profileImage: 'https://example.com/profiles/lawyer8.jpg',
    tags: ['세무', '상속', '기업회계'],
    description:
      '세무사 자격증과 변호사 자격을 모두 보유하고 있으며, 세금 관련 법률 문제와 상속세 절감 방안에 대한 전문 지식을 제공합니다.',
  },
  {
    id: 9,
    name: '강현우',
    lawfirm: '서울 중앙 법무법인',
    profileImage: 'https://example.com/profiles/lawyer9.jpg',
    tags: ['의료', '의료사고', '손해배상'],
    description:
      '의대 출신 변호사로 의료사고 및 의료 분쟁에 대한 깊은 이해를 바탕으로 정확한 법률 서비스를 제공합니다.',
  },
  {
    id: 10,
    name: '윤소라',
    lawfirm: '하나 법률사무소',
    profileImage: 'https://example.com/profiles/lawyer10.jpg',
    tags: ['행정', '환경', '도시계획'],
    description: '행정법 전문 변호사로 정부 기관을 상대로 한 소송과 환경, 도시계획 관련 법률 자문을 전문으로 합니다.',
  },
]

const noticeInputMockData = `•상담을 신청하시면, 상담내용을 공개하는 것으로 간주하며, 언제든지 마이페이지에서 공개/비공개로 바꿀 수 있습니다.
•상담내용을 비공개로 할 경우, 답변이 늦어질 수 있습니다.
•상담글을 작성할 경우 사람을 특정할 수 있는 정보 또는 개인정보를 노출하지 마세요.
•다음과 같은 내용이 포함되어 있다면 상담내용이 삭제되거나, 계정 정지 될 수 있습니다. 
1. 링크, 계정, 전화번호, 주민번호, 주소등이 포함될 경우 
2. 법률문제 해결을 위한 상담 내용이 아닐 경우 
3. 동일한 내용의 상담이 2개 이상 등록 될 경우 
4. 타인 비방(개인/변호사)의 글
•질문이후 24시간 이내 채팅이 이루어 집니다.`
