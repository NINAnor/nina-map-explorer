import React from 'react'
import ReactDOM from 'react-dom/client'
import './components/plausible.js';
import App from './App.jsx'
import './styles/app.scss'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
