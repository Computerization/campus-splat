import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './auth'
import { I18nProvider } from './i18n'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('找不到 #root 挂载点')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
