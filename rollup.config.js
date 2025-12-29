import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: './dist/main.mjs',
    format: 'es',
    sourcemap: 'inline',
  },
  external: (id) => id.startsWith('game'),
  plugins: [typescript()],
})
