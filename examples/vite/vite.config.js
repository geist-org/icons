// refer https://github.com/vitejs/vite/issues/7112

import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [React()],
})
