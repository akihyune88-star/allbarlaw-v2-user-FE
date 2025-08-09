# Search System Reference Document

## Architecture Overview

The search system in the AllBarLaw platform is a comprehensive solution for searching across multiple content types including blogs, videos, legal knowledge, and lawyers. It features a modular architecture with shared components, hooks, and services that enable both basic search and infinite scroll functionality.

### System Structure

```
src/pages/search/
├── SearchRedirect.tsx          # Redirect handler to default search
├── main/
│   ├── SearchMain.tsx          # Main layout container with header
│   └── search-main.module.scss # Main layout styles
├── searchBlog/
│   ├── SearchBlog.tsx          # Blog search implementation
│   └── search-blog.module.scss # Blog search styles
├── searchLawyer/
│   └── SearchLawyer.tsx        # Lawyer search (placeholder)
├── searchLegalKnowledge/
│   └── SearchLegalKnowledge.tsx # Legal knowledge search (placeholder)
├── totalSearch/
│   ├── TotalSearch.tsx         # All-content search
│   └── total-search.module.scss # Total search styles
└── searchCommonStyles.module.scss # Shared search styles
```

## Component Hierarchy

### 1. SearchRedirect (Route Handler)
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\pages\search\SearchRedirect.tsx`

Simple redirect component that automatically navigates users to the default search page.

```tsx
const SearchRedirect = () => {
  return <Navigate to='/search/all' replace />
}
```

**Purpose**: Ensures consistent entry point for search functionality.

### 2. SearchMain (Layout Container)
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\pages\search\main\SearchMain.tsx`

Main layout component that provides the search interface structure.

```tsx
const SearchMain = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const searchQuery = searchParams.get('q') || ''
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const isRootPath = pathSegments.length === 1

  return (
    <div className={styles['search-main']}>
      <SearchHeader searchQuery={searchQuery} />
      <main className={isRootPath ? '' : 'main-container'}>
        <Outlet />
      </main>
    </div>
  )
}
```

**Features**:
- Extracts search query from URL parameters
- Determines root path for conditional styling
- Renders search header with current query
- Uses React Router Outlet for nested routes

### 3. SearchBlog (Content-Specific Search)
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\pages\search\searchBlog\SearchBlog.tsx`

Fully implemented search page for blog content with infinite scroll and sorting.

```tsx
const SearchBlog = () => {
  const [sort, setSort] = useState<SortType>('viewCount')
  const searchQuery = useSearchQuery()
  
  const { hasNextPage, fetchNextPage, isFetchingNextPage, searchResults, searchTotalCounts } = 
    useInfiniteSearchList({
      searchQuery,
      searchTab: 'blog',
      searchSize: 10,
      searchSortBy: sort,
    })

  useInfiniteScroll({
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  })

  return (
    <main className='sub-main-container'>
      <section className={`contents-section ${styles.contentBox}`}>
        <SearchContentHeader />
        <SearchBlogResult searchResults={searchResults?.searchBlogResults || []} />
      </section>
      <aside className='aside'>
        <ContentsRecommender />
        <LegalTermWidget />
      </aside>
    </main>
  )
}
```

**Features**:
- Sortable results (viewCount, likesCount, createdAt)
- Infinite scroll implementation
- AI-powered recommendations sidebar
- Legal term widget integration
- Responsive layout with main content and aside

### 4. SearchLawyer (Placeholder Implementation)
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\pages\search\searchLawyer\SearchLawyer.tsx`

Route handler that conditionally renders lawyer details or search list.

```tsx
const SearchLawyer = () => {
  const { lawyerId } = useParams()
  
  if (lawyerId) {
    return <Outlet /> // LawyerDetail component
  }
  
  return <div>SearchLawyer</div> // Placeholder
}
```

**Note**: Currently a placeholder awaiting full implementation.

### 5. SearchLegalKnowledge (Placeholder)
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\pages\search\searchLegalKnowledge\SearchLegalKnowledge.tsx`

```tsx
const SearchLegalKnowledge = () => {
  return <div>SearchLegalKnowledge</div>
}
```

**Note**: Placeholder for legal knowledge search functionality.

### 6. TotalSearch (All-Content Search)
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\pages\search\totalSearch\TotalSearch.tsx`

Displays search results count and serves as entry point for comprehensive search.

```tsx
const SearchCount = ({ count }: { count: number }) => {
  return (
    <div className={styles['search-count']}>
      <span>총 {count.toLocaleString()}건이 검색되었습니다. </span>
    </div>
  )
}

const TotalSearch = () => {
  return (
    <>
      <SearchCount count={1000} />
      <div className={styles['total-search']}></div>
    </>
  )
}
```

**Note**: Currently shows static count, needs integration with actual search results.

## Routing Structure

**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\routes\index.tsx`

```tsx
{
  path: ROUTER.SEARCH_MAIN, // '/search'
  element: <SearchMain />,
  children: [
    {
      path: '',
      element: <TotalSearch />,
    },
    {
      path: 'blog',
      element: <SearchBlog />,
    },
    {
      path: 'video',
      element: <SearchVideo />,
    },
    {
      path: 'legal-knowledge',
      element: <SearchLegalKnowledge />,
    },
    {
      path: 'lawyer',
      element: <SearchLawyer />,
      children: [
        {
          path: ':lawyerId',
          element: <LawyerDetail />,
        },
      ],
    },
  ],
}
```

**URL Structure**:
- `/search` → `TotalSearch` (all content)
- `/search/blog?q=query` → `SearchBlog` (blog-specific search)
- `/search/video?q=query` → `SearchVideo` (video-specific search)
- `/search/legal-knowledge?q=query` → `SearchLegalKnowledge`
- `/search/lawyer?q=query` → `SearchLawyer` (list)
- `/search/lawyer/123?q=query` → `LawyerDetail` (specific lawyer)

## Data Flow

### API Integration

**Service**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\services\searchService.ts`

```tsx
export const searchService = {
  getSearchBlog: async (request: SearchRequest) => {
    const { searchQuery, searchTab, searchPage, searchSize, searchSortBy, searchLawyerId } = request
    
    const params = new URLSearchParams()
    if (searchQuery !== undefined) params.append('searchQuery', searchQuery)
    if (searchTab !== undefined) params.append('searchTab', searchTab)
    if (searchPage !== undefined) params.append('searchPage', searchPage.toString())
    if (searchSize !== undefined) params.append('searchSize', searchSize.toString())
    if (searchSortBy !== undefined) params.append('searchSortBy', searchSortBy)
    if (searchLawyerId !== undefined) params.append('searchLawyerId', searchLawyerId.toString())

    const response = await instance.get<SearchResponse>(`/search/`, { params })
    return response.data
  },
}
```

### Custom Hooks

**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\hooks\queries\useSearch.ts`

#### useInfiniteSearchList
Primary hook for infinite scroll search functionality:

```tsx
export const useInfiniteSearchList = (request: Omit<SearchRequest, 'searchPage'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.SEARCH, 'infinite', ...requestParams],
    queryFn: ({ pageParam = 1 }) => searchService.getSearchBlog({ ...request, searchPage: pageParam }),
    enabled: !!request.searchQuery,
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchResponse) => {
      if (!lastPage.hasNextPage) return undefined
      return lastPage.currentPage + 1
    },
  })

  // Combine all pages' results
  const allSearchResults = data?.pages.reduce((acc, page) => ({
    searchBlogResults: [...acc.searchBlogResults, ...(page?.searchResults?.searchBlogResults || [])],
    // ... other result types
  }), initialState)

  return {
    searchResults: allSearchResults,
    searchTotalCounts: data?.pages[0]?.searchTotalCounts,
    totalItems: data?.pages[0]?.totalItems ?? 0,
    isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage,
  }
}
```

#### useSearchList
Basic search hook without infinite scroll:

```tsx
export const useSearchList = (request: SearchRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.SEARCH, ...requestParams],
    queryFn: () => searchService.getSearchBlog(request),
  })
}
```

### Infinite Scroll Hook

**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\hooks\useInfiniteScroll.ts`

Advanced infinite scroll implementation with auto-content filling:

```tsx
export const useInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 500,
  enabled = true,
}: UseInfiniteScrollProps) => {
  const fetchingRef = useRef(false)
  const retryCountRef = useRef(0)
  const maxRetries = 5

  const checkAndFillContent = useCallback(() => {
    // Auto-fill content if screen isn't full
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const scrollableDistance = scrollHeight - clientHeight
    const needsMoreContent = scrollableDistance < 100

    if (needsMoreContent && hasNextPage && !isFetchingNextPage && !fetchingRef.current) {
      if (retryCountRef.current >= maxRetries) return
      
      fetchingRef.current = true
      retryCountRef.current++
      fetchNextPage()
      
      setTimeout(() => {
        fetchingRef.current = false
        setTimeout(checkAndFillContent, 100)
      }, 1000)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, enabled])

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

    if (isNearBottom && hasNextPage && !isFetchingNextPage && !fetchingRef.current) {
      fetchingRef.current = true
      fetchNextPage()
      setTimeout(() => fetchingRef.current = false, 500)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold, enabled])

  // Event listeners and auto-fill logic
  useEffect(() => {
    if (!enabled) return undefined
    window.addEventListener('scroll', handleScroll)
    checkAndFillContent()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, checkAndFillContent, enabled])
}
```

**Features**:
- Auto-content filling when screen isn't full
- Configurable scroll threshold
- Max retry limit to prevent infinite loops
- Multiple trigger conditions for content loading

## Type Definitions

**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\types\searchTypes.ts`

### Core Types

```tsx
export type SearchTab = 'all' | 'blog' | 'video' | 'consultation' | 'lawyer'

export type SearchRequest = {
  searchQuery?: string
  searchTab?: SearchTab
  searchSize?: number
  searchSortBy?: SortType  // 'viewCount' | 'likesCount' | 'createdAt'
  searchLawyerId?: number
  searchPage?: number      // Used only in basic search
}

export type SearchResponse = {
  searchQuery: string
  searchTab: SearchTab
  searchTotalCounts: {
    searchTotalBlogCount: number
    searchTotalVideoCount: number
    searchTotalConsultationCount: number
    searchTotalLawyerCount: number
  }
  searchResults: {
    searchBlogResults: BlogCase[]
    searchVideoResults: VideoCase[]
    searchConsultationResults: KnowledgeItem[]
    searchLawyerResults: Lawyer[]
  }
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  totalItems: number
}
```

### Sort Types

```tsx
export type SortType = 'viewCount' | 'likesCount' | 'createdAt'
```

## Shared Components

### SearchHeader
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\container\search\searchHedaer\SearchHeader.tsx`

Main navigation header for search pages:

```tsx
type SearchHeaderProps = {
  searchQuery: string
}

const SearchHeader = ({ searchQuery }: SearchHeaderProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const handleMenuClick = (path: string) => {
    const basePath = path === '/' ? '' : path
    navigate(`/search${basePath}?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className={styles['search-header']}>
      <h2>찾고자하는 법률정보를 검색해보세요.
          업그레이드된 올바로 2.0은 모든 법률정보를 갖고 있습니다.</h2>
      <span className={styles['search-query']}>
        <strong>"{searchQuery}"</strong> 검색결과 입니다.
      </span>
      <Tabs items={SEARCH_TAB_LIST} onChange={handleMenuClick} initialPath={'/'} />
    </header>
  )
}
```

**Features**:
- Displays current search query
- Tab navigation between search categories
- Preserves query parameter during navigation

### SearchContentHeader
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\container\search\searchContentHeader\SearchContentHeader.tsx`

Provides result count and sorting options:

```tsx
type SearchContentHeaderProps = {
  amount: number
  searchTab: SortType
  handleSearchTab: (_sort: SortType) => void
}

const SearchContentHeader = ({ amount, searchTab, handleSearchTab }: SearchContentHeaderProps) => {
  return (
    <div className={styles['search-content-header']}>
      <span className={styles['amount']}>총 {amount.toLocaleString()}건이 검색되었습니다.</span>
      <section className={styles['button-wrapper']}>
        <button onClick={() => handleSearchTab('viewCount')} 
                className={searchTab === 'viewCount' ? styles['active'] : ''}>
          추천수
        </button>
        <button onClick={() => handleSearchTab('likesCount')} 
                className={searchTab === 'likesCount' ? styles['active'] : ''}>
          공감순
        </button>
        <button onClick={() => handleSearchTab('createdAt')} 
                className={searchTab === 'createdAt' ? styles['active'] : ''}>
          최신순
        </button>
      </section>
    </div>
  )
}
```

### SearchBlogResult
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\container\search\searchBlogResult\SearchBlogResult.tsx`

Renders blog search results:

```tsx
type SearchBlogResultProps = {
  searchResults: SearchResponse['searchResults']['searchBlogResults']
}

const SearchBlogResult = ({ searchResults }: SearchBlogResultProps) => {
  return (
    <div className={styles['search-blog-result']}>
      {searchResults?.map(result => (
        <BlogItem key={result.blogCaseId} item={result} />
      ))}
    </div>
  )
}
```

## Constants and Configuration

### Search Tab Configuration
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\constants\searchConstants.ts`

```tsx
export const SEARCH_TAB_LIST = [
  { name: '전체', itemWidth: 84, path: '/' },
  { name: '법률정보의 글', itemWidth: 98, path: ROUTER.BLOG },
  { name: '변호사의 영상', itemWidth: 98, path: ROUTER.VIDEO },
  { name: '법률 지식인', itemWidth: 84, path: ROUTER.LEGAL_KNOWLEDGE },
  { name: '변호사', itemWidth: 84, path: ROUTER.LAWYER },
]
```

### Router Constants
**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\routes\routerConstant.ts`

```tsx
export const ROUTER = {
  SEARCH_MAIN: '/search',
  BLOG: '/blog',
  VIDEO: '/video',
  LEGAL_KNOWLEDGE: '/legal-knowledge',
  LAWYER: '/lawyer',
  // ... other routes
}
```

## Utility Functions

**File**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE\src\utils\urlUtils.ts`

### URL Search Utilities

```tsx
// Extract search query from current URL
export const useSearchQuery = () => {
  const [searchParams] = useSearchParams()
  return searchParams.get('q') || ''
}

// Get search query from URLSearchParams object
export const getSearchQuery = (searchParams: URLSearchParams) => {
  return searchParams.get('q') || ''
}

// Create search URL with query parameter
export const createSearchUrl = (query: string, basePath: string = '/search') => {
  if (!query) return basePath
  return `${basePath}?q=${encodeURIComponent(query)}`
}

// Update search query in current URL
export const updateSearchQuery = (newQuery: string) => {
  const params = new URLSearchParams(window.location.search)
  if (newQuery) {
    params.set('q', newQuery)
  } else {
    params.delete('q')
  }
  return params
}
```

## Usage Examples

### Basic Search Implementation

```tsx
import { useSearchList } from '@/hooks/queries/useSearch'
import { useSearchQuery } from '@/utils/urlUtils'

const MySearchComponent = () => {
  const searchQuery = useSearchQuery()
  
  const { data, isLoading, isError } = useSearchList({
    searchQuery,
    searchTab: 'blog',
    searchPage: 1,
    searchSize: 10,
    searchSortBy: 'viewCount',
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error occurred</div>

  return (
    <div>
      {data?.searchResults.searchBlogResults.map(item => (
        <div key={item.blogCaseId}>{item.title}</div>
      ))}
    </div>
  )
}
```

### Infinite Scroll Implementation

```tsx
import { useInfiniteSearchList } from '@/hooks/queries/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useSearchQuery } from '@/utils/urlUtils'

const InfiniteSearchComponent = () => {
  const searchQuery = useSearchQuery()
  const [sort, setSort] = useState<SortType>('viewCount')
  
  const { 
    searchResults, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage 
  } = useInfiniteSearchList({
    searchQuery,
    searchTab: 'blog',
    searchSize: 10,
    searchSortBy: sort,
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 500,
  })

  return (
    <div>
      {searchResults?.searchBlogResults.map(item => (
        <div key={item.blogCaseId}>{item.title}</div>
      ))}
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  )
}
```

### Navigation with Search Query

```tsx
import { useNavigate } from 'react-router-dom'
import { createSearchUrl } from '@/utils/urlUtils'

const NavigationComponent = () => {
  const navigate = useNavigate()

  const handleSearch = (query: string, tab: string = '') => {
    const searchUrl = createSearchUrl(query, `/search${tab}`)
    navigate(searchUrl)
  }

  return (
    <div>
      <button onClick={() => handleSearch('법률', '/blog')}>
        Search Blogs for "법률"
      </button>
      <button onClick={() => handleSearch('변호사', '/lawyer')}>
        Search Lawyers for "변호사"
      </button>
    </div>
  )
}
```

## Development Status

### Implemented Features
- ✅ Search routing and navigation
- ✅ Blog search with infinite scroll
- ✅ Sort functionality (viewCount, likesCount, createdAt)
- ✅ Search query URL parameter handling
- ✅ Responsive layout with sidebar components
- ✅ Auto-content filling for infinite scroll
- ✅ Search result counting and display

### Pending Implementation
- ⏳ Video search functionality
- ⏳ Legal knowledge search implementation
- ⏳ Lawyer search list view
- ⏳ Total search integration with actual data
- ⏳ Error handling and loading states
- ⏳ Search result caching strategies

### Architecture Strengths
- **Modular Design**: Clear separation of concerns
- **Reusable Components**: Shared header, content components
- **Type Safety**: Comprehensive TypeScript definitions
- **Performance**: Infinite scroll with auto-filling
- **URL Management**: Clean query parameter handling
- **Responsive**: Mobile-friendly layout structure

### Recommended Improvements
1. **Error Boundaries**: Add comprehensive error handling
2. **Loading States**: Implement skeleton screens and loading indicators
3. **Caching Strategy**: Implement search result caching
4. **Accessibility**: Add ARIA labels and keyboard navigation
5. **Performance**: Implement result virtualization for large datasets
6. **Testing**: Add unit and integration tests
7. **Analytics**: Add search analytics and tracking

This search system provides a solid foundation for comprehensive legal content discovery with room for feature expansion and optimization.