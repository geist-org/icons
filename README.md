# React Icons

React icon components based on [Vercel Design](https://vercel.com/design)

[![npm Version](https://img.shields.io/npm/v/@zeit-ui/react-icons)](https://www.npmjs.com/package/@zeit-ui/react-icons)
[![Build](https://img.shields.io/github/workflow/status/zeit-ui/react-icons/Build)](https://github.com/zeit-ui/react-icons/actions?query=workflow%3ABuild)

## Install

```
$ yarn add @zeit-ui/react-icons
OR
$ npm install @zeit-ui/react-icons
```

## Usage

```tsx
import React from 'react'
import { GitHub } from '@zeit-ui/react-icons'

const App = () => {
  return <GitHub />
}

export default App
```

Icons can be configured with `color`, `size` and any SVG props:

```ts
<GitHub color="red" size={36} />
<GitHub color="blue" strokeWidth={2} />

```

You can also include the whole icon pack:

```tsx
import React from 'react'
import * as Icon from '@zeit-ui/react-icons'

const App = () => {
  return <Icon.GitHub />
}

export default App
```
