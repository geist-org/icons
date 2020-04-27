import React, { useState } from 'react'
import ReactDom from 'react-dom'
import { ZEITUIProvider, CSSBaseline } from '@zeit-ui/react'
import Home from './home'

const App = () => {
  const [dark, setDark] = useState(false)
  
  return (
    <ZEITUIProvider theme={{ type: dark ? 'dark' : 'light' }}>
      <CSSBaseline />
      <Home onThemeChange={() => setDark(last => !last)} />
    </ZEITUIProvider>
  )
}

ReactDom.render(
  (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ),
  document.getElementById('app')
)

export default App
