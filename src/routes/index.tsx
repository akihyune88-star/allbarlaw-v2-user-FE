import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NotFound from '../pages/NotFound'
import Main from '../pages/Main'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Main />,
      },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
