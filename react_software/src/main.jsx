import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Table from './table.jsx'
import Header from './Header.jsx'
import UpdateForm from './updateform.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Header />
    <UpdateForm />
    <Table />
  </StrictMode>,
)
