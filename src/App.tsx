import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ChatPage from './pages/ChatPage'
import CommunityTemplate from './templates/CommunityTemplate'
import Root from './pages/Root'
import Home from './pages/Home'
import Community from './pages/Community'
import NotFound from './pages/NotFound'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      ErrorBoundary: NotFound,
      children: [
        { index: true, Component: Home },
        {
          path: "/room/:roomId",
          Component: CommunityTemplate,
          children: [
            { index: true, Component: Community },
            {
              path: "/room/:roomId/text",
              Component: ChatPage
            }
          ]
        },
      ]
    }
  ]);

  return (
    <main className='min-h-screen h-full w-full font-inter bg-bg-light text-text-title'>

      <div className='w-full h-full max-h-screen flex flex-row'>
        <RouterProvider router={router} />
      </div>

    </main>
  )
}

export default App
