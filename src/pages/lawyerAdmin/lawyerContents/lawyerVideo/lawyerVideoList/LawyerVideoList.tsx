import styles from './lawyerVideoList.module.scss'
import { useOutletContext, useNavigate } from 'react-router-dom'
import type { LawyerVideoLayoutContext } from '../lawyerVideoLayout/LawyerVideoLayout'
import { useInfiniteVideoList } from '@/hooks/queries/useGetVideoList'
import React, { useState } from 'react'
import { SortType } from '@/types/sortTypes'
import { getLawyerIdFromToken } from '@/utils/tokenUtils'
import { LOCAL } from '@/constants/local'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import { ROUTER } from '@/routes/routerConstant'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'
import VideoHorizon from '@/components/video/VideoHorizon'

interface VideoListHeaderProps {
  sortCase: SortType
  setSortCase: (_sort: SortType) => void
  search: string
  setSearch: (_search: string) => void
  videoCount: number
  onSearch: (_search: string) => void
}

const VideoListHeader = ({ sortCase, setSortCase, search, videoCount, onSearch }: VideoListHeaderProps) => {
  const [searchInput, setSearchInput] = useState(search)

  const handleSearch = () => {
    onSearch(searchInput)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const sortOptions = [
    { value: 'createdAt', label: '최신순' },
    { value: 'viewCount', label: '조회순' },
    { value: 'likesCount', label: '추천순' },
  ]

  return (
    <header className={styles['video-list-header']}>
      <div className={styles['video-list-header-top']}>
        <h2 className={styles['video-list-header-title']}>영상</h2>
      </div>
      <div className={styles['video-list-header-bottom']}>
        <div className={styles['video-list-header-search']}>
          <input
            type='text'
            placeholder='검색어를 입력하세요'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles['video-list-header-search-input']}
          />
          <button onClick={handleSearch} className={styles['video-list-header-search-button']} aria-label='검색'>
            <SvgIcon name='search' size={20} />
          </button>
        </div>
        <div className={styles['video-list-header-actions-right']}>
          <span className={styles['video-list-header-count']}>전체 {videoCount}개</span>
          <div className={styles['video-list-header-sort-buttons']}>
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`${styles['video-list-header-sort-button']} ${
                  sortCase === option.value ? styles.active : ''
                }`}
                onClick={() => setSortCase(option.value as SortType)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

const LawyerVideoList = () => {
  const { selectedSubcategoryId } = useOutletContext<LawyerVideoLayoutContext>()
  const navigate = useNavigate()
  const [sortCase, setSortCase] = useState<SortType>('createdAt')
  const [search, setSearch] = useState<string>('')
  const { data: lawyerBasicInfo } = useLawyerDetailForMe()
  const lawyerId = getLawyerIdFromToken(sessionStorage.getItem(LOCAL.TOKEN) || localStorage.getItem(LOCAL.TOKEN) || '')
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { videoList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteVideoList({
    subcategoryId: selectedSubcategoryId ? Number(selectedSubcategoryId) : 'all',
    take: 10,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
    lawyerId: lawyerId || undefined,
    search: search.trim() || undefined,
  })

  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const onClickItem = (videoCaseId: number) => {
    navigate(`${ROUTER.LAWYER_ADMIN_CONTENT_VIDEO_DETAIL}/${videoCaseId}`)
  }

  const onSearch = (search: string) => setSearch(search)

  const handleExcelUpload = () => {
    console.log('ExcelUpload')
  }

  const handleDirectUpload = () => {
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO_EDIT)
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>{lawyerBasicInfo?.lawyerName}변호사님이 등록한 법률영상입니다.</h1>
          <div className={styles.headerButtonWrapper}>
            <button type='button' onClick={handleExcelUpload}>
              영상 등록(Excel)
            </button>
            <button type='button' onClick={handleDirectUpload}>
              영상 등록(직접)
            </button>
          </div>
        </div>
      </HeaderPortal>
      <div className={styles['lawyer-video-list']}>
        <VideoListHeader
          sortCase={sortCase}
          setSortCase={setSortCase}
          search={search}
          setSearch={setSearch}
          videoCount={videoList.length}
          onSearch={onSearch}
        />
        <section className={styles['video-list']} aria-label='영상 목록'>
          {videoList.length > 0 ? (
            videoList.map((videoItem, idx) => (
              <React.Fragment key={videoItem.videoCaseId}>
                <VideoHorizon
                  thumbnailUrl={videoItem.thumbnail}
                  title={videoItem.title}
                  videoCaseId={videoItem.videoCaseId}
                  isKeep={videoItem.isKeep}
                  lawyerName={videoItem.lawyerName}
                  lawfirmName={videoItem.lawfirmName}
                  channelName={videoItem.channelName}
                  channelThumbnail={videoItem.channelThumbnail}
                  summaryContents={videoItem.summaryContent}
                  onClick={() => onClickItem(videoItem.videoCaseId)}
                />
                {isMobile || (idx !== videoList.length - 1 && <Divider padding={24} />)}
              </React.Fragment>
            ))
          ) : (
            <div className={styles['video-list-empty']}>
              <p>등록된 영상이 없습니다.</p>
              <button type='button' className={styles['video-list-empty-button']} onClick={handleDirectUpload}>
                영상 등록하기
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default LawyerVideoList
