import styles from '@/container/lawfirm/lawfirm-list.module.scss'
import LawfirmHorizon from '@/components/lawfirm/LawfirmHorizon'
import MultipleImageSlider from '@/components/multipleImageSlider/MultipleImageSlider'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const LawfirmList = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const lawfirmList = [1, 2, 3, 4, 5]
  const lawfirmImageList = [
    'https://i.pinimg.com/236x/b7/45/ef/b745ef9bb3bd41f685850cdd85a19338.jpg',
    'https://blog.kakaocdn.net/dn/dizXY5/btrkIPfapS1/jt8zro5LbaSUub4dDmSW6k/img.jpg',
    'https://i.namu.wiki/i/4T0aWSWhvnLap_eu6XKq8O8xTiRr-OWZEFyLSSGFnrcYNjd-cNJev07uleO3UHlQgHkPJpqB2eNjWZ0YCU5cvA.webp',
    'https://i.namu.wiki/i/6kfaPjBWrl5WQtOkig8o4LaUp2-l1mFGZENCTrS7Q6gT9erdnNEXDLZv9QvbaTeOJfuAwD1ws9DfdtPgj2Zi9Q.webp',
    'https://item.kakaocdn.net/do/ac71c1fd0ef230ab626c93ee2d98934df604e7b0e6900f9ac53a43965300eb9a',
    'https://lawus.co.kr/resource/images/sub_member_m2.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_13ATI41YpHNiNHS-V_Z2mnINWYFyKIeZT8568Td95YbidzYmgIe3p5sAlMQihAmLgaU&usqp=CAU',
  ]

  return lawfirmList.map(_lawfirm => (
    <div className={styles['lawfirm-list']}>
      <div className={styles['lawfirm-item']}>
        <LawfirmHorizon
          className={styles['content-wrapper']}
          lawfirmThumbnail='https://picsum.photos/200/300'
          lawfirmName='법률사무소 가온길'
          title='전문성과 경험으로 의뢰인의 고민을 해결해드리겠습니다. '
          description={
            '단 한 번의 기회, 더신사 법무법인과 함께 하세요. ' +
            '각 분야 전문 변호사들의 차별화된 전략으로 기대 이상의 결과를 만들어냅니다'
          }
          address='서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층'
          phoneNumber='02-123-4567'
          homepageUrl='https://example.com'
          linkList={[
            { label: '변호사소개', url: 'https://example.com' },
            { label: '유튜브', url: 'https://example.com' },
            { label: '블로그', url: 'https://example.com' },
            { label: '의뢰인후기', url: 'https://example.com' },
          ]}
        />
        {lawfirmImageList && <MultipleImageSlider imageList={lawfirmImageList} width={isMobile ? 335 : 796} />}
      </div>
    </div>
  ))
}

export default LawfirmList
