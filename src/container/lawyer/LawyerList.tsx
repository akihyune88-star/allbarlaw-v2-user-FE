import ArticleHeader from '@/components/articleHeader/ArticleHeader'
// import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useState } from 'react'

const LawyerList = () => {
  const [sortCase, setSortCase] = useState<string>('all')
  // const isMobile = useMediaQuery('(max-width: 80rem)')

  // const lawyerList = [1, 2, 3, 4, 5]

  const handleSortCase = (key: string) => {
    setSortCase(key)
  }

  return (
    <div>
      <header>
        <ArticleHeader
          title={`변호사의 영상을 보고\n내 법률 문제의 해결방법을 찾으세요`}
          mobileTitle={`변호사의 영상을 보고\n내 법률 문제의 해결방법을 찾으세요.`}
          onClick={handleSortCase}
          activeKey={sortCase}
          totalBlogCount={2147}
          recentBlogCount={4142}
        />
      </header>
    </div>
  )
}

export default LawyerList
