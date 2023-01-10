import React, { useState } from 'react'
import ReactDom from 'react-dom'
import { GeistProvider, CssBaseline, Themes } from '@geist-ui/react'
import Home from './home'

const App = () => {
  const [dark, setDark] = useState(false)

  return (
    <GeistProvider themes={Themes.getPresets()} themeType={dark ? 'dark' : 'light'}>
      <CssBaseline />
      <Home onThemeChange={() => setDark(last => !last)} />
    </GeistProvider>
  )
}

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
)

export default App
