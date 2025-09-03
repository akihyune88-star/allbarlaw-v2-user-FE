import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { useLawyerActive } from '@/hooks/queries/useLawyer'
import { LawyerActiveResponse } from '@/types/lawyerTypes'
import styles from './recentActiveLawyer.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { useChunkedRotate } from '@/hooks/useChunkedRotate'

const RecentActiveLawyer = () => {
  const { data: lawyerActive } = useLawyerActive({
    take: 20,
  })

  const { visibleItems, rotateNext } = useChunkedRotate<LawyerActiveResponse['data'][number]>(lawyerActive ?? [], 5)

  return (
    <div className={styles['recent-active-lawyer-container']}>
      <header className={styles['header']}>
        <h3 className={styles['header-title']}>
          최근 답변이 많은
          <br />
          변호사 입니다.
        </h3>
        <button onClick={rotateNext}>
          <SvgIcon name='refresh' />
        </button>
      </header>

      <section className={styles['recent-active-lawyer']}>
        {visibleItems.map((lawyer: LawyerActiveResponse['data'][number]) => (
          <LawyerHorizon
            key={lawyer.lawyerId}
            lawyerId={lawyer.lawyerId}
            name={lawyer.lawyerName}
            profileImage={lawyer.lawyerProfileImage}
            description={lawyer.lawyerDescription}
            size='x-small'
          />
        ))}
      </section>
    </div>
  )
}

export default RecentActiveLawyer
