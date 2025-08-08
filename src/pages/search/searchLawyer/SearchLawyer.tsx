import { Outlet, useParams } from 'react-router-dom'

const SearchLawyer = () => {
  const { lawyerId } = useParams()
  
  // lawyerId가 있으면 Outlet(LawyerDetail)을 렌더링, 없으면 목록을 렌더링
  if (lawyerId) {
    return <Outlet />
  }
  
  return <div>SearchLawyer</div>
}

export default SearchLawyer
