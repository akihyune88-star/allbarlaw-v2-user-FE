import Divider from '@/components/divider/Divider'
import styles from './lawyerActivity.module.scss'

const LawyerActivity = () => {
  return (
    <section className={styles['lawyer-activity']}>
      <h3 className={styles['activity-title']}>올바로 활동</h3>
      <Divider padding={14} />
      <table className={styles['horizontal-table']}>
        <thead>
          <tr>
            <th>가입일자</th>
            <th>방문횟수/최근1달</th>
            <th>법률정보의 글</th>
            <th>변호사의 영상</th>
            <th>법률 지식인 답변</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-01-01</td>
            <td>100</td>
            <td>100</td>
            <td>100</td>
            <td>100</td>
          </tr>
        </tbody>
      </table>

      <table className={styles['vertical-table']}>
        <tbody>
          <tr>
            <th>올바로 변호사</th>
            <td>2024.12.01</td>
          </tr>
          <tr>
            <th>방문횟수 전체/최근1달</th>
            <td>1,726 / 24</td>
          </tr>
          <tr>
            <th>블로그글</th>
            <td>521</td>
          </tr>
          <tr>
            <th>법률 영상</th>
            <td>12</td>
          </tr>
          <tr>
            <th>법률 지식인 답변</th>
            <td>614</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default LawyerActivity
