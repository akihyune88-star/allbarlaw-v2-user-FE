export interface Lawyer {
  id: number
  name: string
  lawfirm: string
  profileImage: string
  tags: string[]
  description: string
}

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
