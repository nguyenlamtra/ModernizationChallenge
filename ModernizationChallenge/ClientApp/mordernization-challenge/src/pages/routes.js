import { lazy } from 'react'

const TaskPage = lazy(() => import('./task'))
const routes = [
  {
    path: '/',
    exact: true,
    public: true,
    component: <TaskPage />,
  },
]
export default routes
