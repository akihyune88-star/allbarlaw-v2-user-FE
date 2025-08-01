// 랜덤 이름 생성을 위한 데이터
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']
const firstNames = [
  '민준',
  '서준',
  '예준',
  '도윤',
  '시우',
  '주원',
  '하준',
  '지호',
  '지후',
  '준서',
  '서연',
  '서윤',
  '지우',
  '서현',
  '민서',
  '하은',
  '하윤',
  '윤서',
  '지유',
  '채원',
]

// 전문 분야 키워드
const specialties = [
  '형사',
  '민사',
  '부동산',
  '상속',
  '이혼',
  '교통사고',
  '산재',
  '의료',
  '지식재산권',
  '기업법무',
  '조세',
  '행정',
  '노동',
  '금융',
  '건설',
  '환경',
  '특허',
  '저작권',
]

// 설명 생성을 위한 문구
const descriptionTemplates = [
  '전문성과 경험을 바탕으로 의뢰인의 권익 보호에 최선을 다합니다.',
  '체계적이고 전략적인 법률 서비스를 제공합니다.',
  '고객 만족을 최우선으로 생각하며 성실하게 상담해드립니다.',
  '풍부한 실무 경험을 바탕으로 최적의 해결책을 제시합니다.',
  '신속하고 정확한 법률 서비스로 의뢰인의 문제 해결을 돕습니다.',
]

// 랜덤 숫자 생성 함수
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 랜덤 요소 선택 함수
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// 랜덤 변호사 정보 생성 함수
export const generateRandomLawyer = (id?: number) => {
  const lastName = getRandomElement(lastNames)
  const firstName = getRandomElement(firstNames)
  const name = lastName + firstName

  // 2~3개의 랜덤 전문분야 선택
  const specialtyCount = getRandomInt(2, 3)
  const shuffledSpecialties = [...specialties].sort(() => Math.random() - 0.5)
  const selectedSpecialties = shuffledSpecialties.slice(0, specialtyCount)

  // 랜덤 설명 생성
  const description = `${name} 변호사는 ${selectedSpecialties.join(', ')} 분야에서 ${getRandomElement(
    descriptionTemplates
  )}`

  // 랜덤 이미지 생성 (picsum.photos 사용)
  const randomImageId = getRandomInt(1, 1000)
  const profileImage = `https://picsum.photos/seed/${randomImageId}/200/200`

  return {
    lawyerId: id || getRandomInt(1, 1000),
    lawyerName: name,
    lawfirmName: description,
    lawyerProfileImage: profileImage,
    specialties: selectedSpecialties,
  }
}

// 여러 명의 랜덤 변호사 정보 생성
export const generateRandomLawyers = (count: number) => {
  return Array.from({ length: count }, (_, index) => generateRandomLawyer(index + 1))
}

// 예시 사용:
// const randomLawyer = generateRandomLawyer();
// const randomLawyers = generateRandomLawyers(5);
