import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LocaleProvider } from './components/i18n/LocaleProvider'
import './styles.css'
import './styles/polish.css'
import './styles/i18n.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider><App /></LocaleProvider>
  </StrictMode>,
)
