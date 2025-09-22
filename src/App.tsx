import './App.css'
import Index from './pages/Index'
import { BrowserRouter, Route, Routes } from 'react-router'
import ChatPage from './pages/ChatPage'

function App() {

  return (
    <BrowserRouter>
      <main className='min-h-screen h-screen font-roboto bg-neutral-100'>

        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/chat' element={<ChatPage />} />
        </Routes>

      </main>
    </BrowserRouter>
  )
}

export default App
