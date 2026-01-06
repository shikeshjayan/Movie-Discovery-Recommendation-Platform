import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/global_style.css'
import App from './App.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <HistoryProvider>
        <App />
      </HistoryProvider>
    </ThemeProvider>
  </StrictMode>,
)
