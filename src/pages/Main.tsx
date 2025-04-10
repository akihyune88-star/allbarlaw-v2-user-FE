import { Outlet } from 'react-router-dom'

function Main() {
  return (
    <div>
      <h1>Main Page</h1>
      <Outlet />
    </div>
  )
}

export default Main
