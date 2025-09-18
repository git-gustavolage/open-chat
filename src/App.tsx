
import './App.css'
import { Editor } from './Editor'
import type { BlockType } from './types/types'

function App() {

  const block: BlockType = {
    id: "1",
    value: "",
    position: 1,
    createdAt: new Date(),
  }

  return (
    <>
      <main className='font-roboto'>

        <Editor initialBlocks={[block]} currentUser="1" />

      </main>
    </>
  )
}

export default App
