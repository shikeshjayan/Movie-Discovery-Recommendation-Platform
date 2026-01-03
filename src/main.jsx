import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/global_style.css'
import App from './App.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
