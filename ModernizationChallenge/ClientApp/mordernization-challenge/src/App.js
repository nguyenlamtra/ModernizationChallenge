import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './pages/routes'
import Snackbar from './components'
function App() {
  return (
    <Snackbar>
      <BrowserRouter>
        <Routes>
          {routes.map(({ component: Component, path, ...rest }) => {
            return (
              <Route key={path} element={Component} path={path} {...rest} />
            )
          })}
        </Routes>
      </BrowserRouter>
    </Snackbar>
  )
}

export default App
