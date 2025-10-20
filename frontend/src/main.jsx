import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Fire-and-forget warmup: trigger backend to preload embedding model so first user request is fast
try {
  fetch('/warmup', { method: 'GET', cache: 'no-cache' })
    .then(res => {
      if (!res.ok) console.warn('Warmup returned non-OK status', res.status)
      return res.json().catch(() => null)
    })
    .then(body => {
      if (body) console.info('Warmup:', body)
    })
    .catch(err => console.warn('Warmup request failed', err))
} catch (e) {
  // ignore - in some build environments global fetch may not be available at module evaluation
}
