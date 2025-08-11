import { useInfiniteMyLawyerList } from '@/hooks/queries/useMypage'
import styles from './myLawyer.module.scss'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import Divider from '@/components/divider/Divider'
import { useNavigate } from 'react-router-dom'
import { Lawyer } from '@/types/lawyerTypes'

const MyLawyer = ({ sort }: { sort: 'asc' | 'desc' }) => {
  const navigate = useNavigate()
  const { lawyerList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteMyLawyerList({
    take: 10,
    sort: sort,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleLawyerDetail = (lawyer: Lawyer) => {
    navigate(`/search/lawyer/${lawyer.lawyerId}`)
  }

  return (
    <div className={styles.myLawyer}>
      {lawyerList.length === 0 ? (
        <div className={styles.emptyMessage}>등록된 Keep이 없습니다.</div>
      ) : (
        <div>
          {lawyerList.map((lawyer, index) => (
            <>
              <LawyerHorizon
                key={lawyer.lawyerId}
                name={lawyer.lawyerName}
                lawyerId={lawyer.lawyerId}
                profileImage={lawyer.lawyerProfileImage}
                description={lawyer.lawyerDescription}
                tags={lawyer.tags}
                isBaroTalk={true}
                className={styles.lawyerItem}
                ad={true}
                onClick={() => handleLawyerDetail(lawyer)}
              />
              {index !== lawyerList.length - 1 && <Divider padding={16} />}
            </>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyLawyer
