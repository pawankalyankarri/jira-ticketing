import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AllRoutes } from './Router.tsx'
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <AllRoutes/>
        <Toaster theme='light' richColors position="top-right" />

    </BrowserRouter>
  </StrictMode>,
)
