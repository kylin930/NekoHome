import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import packageConfig from '../package.json'
import './index.css'

console.log(" %c NekoHome %c By kylin930 | https://www.xiaorin.com/", "color: #FFFFFF; background: #62A0EA; padding:6px;", "color: #FFFFFF; background: #424242; padding:6px;");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
