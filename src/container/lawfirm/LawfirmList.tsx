import styles from '@/container/lawfirm/lawfirm-list.module.scss'
import MultipleImageSlider from '@/components/multipleImageSlider/MultipleImageSlider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'
import LawfirmHorizon from './lawfirmHorizon/LawfirmHorizon'
import { Fragment } from 'react/jsx-runtime'
import { Lawfirm } from '@/types/lawfirmType'

interface LawfirmListProps {
  lawfirmList: Lawfirm[]
  isLoading: boolean
  isFetchingNextPage: boolean
  onClickItem?: (_lawfirmId: number) => void
}

const LawfirmList = ({ lawfirmList, isLoading, isFetchingNextPage, onClickItem }: LawfirmListProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  return (
    <main className={styles['lawfirm-container']}>
      <header className={styles['lawfirm-header']}>
        {isMobile && <h3>로펌</h3>}
        <h2>{`분야별 특별한 로펌을 찾으신다면..\n여기서 찾아서 선택하고 상담을 진행하시면 해결 가능합니다.`}</h2>
      </header>
      {isMobile && (
        <section className={styles['lawfirm-filter']}>
          <button>필터</button>
          <div></div>
        </section>
      )}
      <section className={styles['lawfirm-list']} aria-label='로펌 목록'>
        {!isLoading && lawfirmList.length === 0 && (
          <div className={styles['empty-state']}>
            <p>등록된 로펌이 없습니다.</p>
          </div>
        )}
        {lawfirmList.map((lawfirm, idx) => {
          const imageList = lawfirm.lawfirmImages.map(image => image.lawfirmImageUrl)
          const hasImages = imageList && imageList.length > 0

          return (
            <Fragment key={lawfirm.lawfirmId}>
              <div
                key={lawfirm.lawfirmId}
                className={`${styles['lawfirm-item']} ${hasImages ? styles['has-images'] : ''}`}
                style={{ width: isMobile ? '100%' : '796px', cursor: onClickItem ? 'pointer' : 'default' }}
                onClick={() => onClickItem?.(lawfirm.lawfirmId)}
              >
                <LawfirmHorizon
                  className={styles['content-wrapper']}
                  lawfirmId={lawfirm.lawfirmId}
                  lawfirmThumbnail={lawfirm.lawfirmLogoImageUrl}
                  blogUrl={lawfirm.lawfirmBlogUrl}
                  lawfirmName={lawfirm.lawfirmName}
                  title={lawfirm.lawfirmGreetingTitle}
                  description={lawfirm.lawfirmGreetingContent}
                  address={lawfirm.lawfirmAddress}
                  phoneNumber={lawfirm.lawfirmContact}
                  homepageUrl={lawfirm.lawfirmHomepageUrl}
                  linkList={lawfirm.lawfirmDirects}
                />
                {hasImages && <MultipleImageSlider imageList={imageList} width={isMobile ? 335 : 796} />}
              </div>
              {idx !== lawfirmList.length - 1 && <Divider padding={0} />}
            </Fragment>
          )
        })}

        {/* 로딩 인디케이터 */}
        {(isLoading || isFetchingNextPage) && (
          <div className={styles['loading-container']}>
            <div className={styles['loading-text']}>로딩 중...</div>
          </div>
        )}
      </section>
    </main>
  )
}

export default LawfirmList
