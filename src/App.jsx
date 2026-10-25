import react from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { LoanAppProvider } from './context/LoanAppContext'

function App() {
  return (
      <LoanAppProvider>
        <RouterProvider router={router} />
      </LoanAppProvider>
  )
}

export default App
