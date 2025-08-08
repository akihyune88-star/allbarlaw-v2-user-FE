import { VideoCase } from '@/types/videoTypes'
// import { useNavigate } from 'react-router-dom'

interface TotalSearchVideoListProps {
  searchResults: VideoCase[]
  query: string
}

const TotalSearchVideoList = ({ searchResults, query }: TotalSearchVideoListProps) => {
  // const navigate = useNavigate()

  console.log('searchResults', searchResults, query)

  return <div>TotalVideoList</div>
}

export default TotalSearchVideoList
