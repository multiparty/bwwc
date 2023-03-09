import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.join(__dirname, 'src/components'),
      '@constants': path.join(__dirname, 'src/constants'),
      '@context': path.join(__dirname, 'src/context'),
      '@graphql': path.join(__dirname, 'src/graphql'),
      '@guards': path.join(__dirname, 'src/guards'),
      '@layouts': path.join(__dirname, 'src/layouts'),
      '@modules': path.join(__dirname, 'src/modules'),
      '@pages': path.join(__dirname, 'src/pages'),
      '@styles': path.join(__dirname, 'src/styles'),
      '@theme': path.join(__dirname, 'src/theme'),
      '@types': path.join(__dirname, 'src/types'),
      '@utils': path.join(__dirname, 'src/utils')
    }
  },
})
