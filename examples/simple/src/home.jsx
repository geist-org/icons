import React from 'react'
import { Card, Spacer, Button, useTheme } from '@geist-ui/react'
import { Activity, Github, Twitch, Headphones } from '@geist-ui/react-icons'

const Home = ({ onThemeChange }) => {
  const theme = useTheme()

  return (
    <div style={{ width: '500px', margin: '100px auto' }}>
      <Button size="small" onClick={onThemeChange}>
        Switch Theme
      </Button>
      <Spacer />
      <Card shadow>
        <Activity /> <Spacer inline x={0.5} />
        <Github color={theme.palette.success} /> <Spacer inline x={0.5} />
        <Twitch color={theme.palette.warningLight} /> <Spacer inline x={0.5} />
        <Headphones color={theme.palette.purple} />
        <Spacer />
        <Activity size={30} /> <Spacer inline x={0.5} />
        <Github size={30} color={theme.palette.success} /> <Spacer inline x={0.5} />
        <Twitch size={30} color={theme.palette.warningLight} /> <Spacer inline x={0.5} />
        <Headphones size={30} color={theme.palette.purple} />
        <Spacer />
        <Activity size={36} /> <Spacer inline x={0.5} />
        <Github size={36} color={theme.palette.success} /> <Spacer inline x={0.5} />
        <Twitch size={36} color={theme.palette.warningLight} /> <Spacer inline x={0.5} />
        <Headphones size={36} color={theme.palette.purple} />
      </Card>
    </div>
  )
}

export default Home
