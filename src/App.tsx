
import './App.css'
import { Toolbar } from './components/Toolbar'
import WhiteboardEditor from './WhiteboardEditor'

function App() {

  return (
    <>
      <main className='min-h-screen h-screen font-roboto bg-neutral-100'>
        <Toolbar />
        <WhiteboardEditor />
      </main>
    </>
  )
}

export default App
