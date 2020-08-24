import React, { useState } from 'react'
import ReactDom from 'react-dom'
import { GeistUIProvider, CSSBaseline } from '@geist-ui/react'
import Home from './home'

const App = () => {
  const [dark, setDark] = useState(false)

  return (
    <GeistUIProvider theme={{ type: dark ? 'dark' : 'light' }}>
      <CSSBaseline />
      <Home onThemeChange={() => setDark((last) => !last)} />
    </GeistUIProvider>
  )
}

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
)

export default App
