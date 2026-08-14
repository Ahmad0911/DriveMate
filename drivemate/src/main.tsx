import { createRoot } from 'react-dom/client'
import App from './components/DriveMateApp.jsx'
import { StrictMode } from 'react'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)