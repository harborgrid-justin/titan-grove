import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Define the root for the React app
  root: 'src/ui/react',
  
  // Build configuration
  build: {
    outDir: '../../../dist/ui',
    emptyOutDir: true,
    sourcemap: true,
  },
  
  // Development server configuration
  server: {
    port: 3001,
    host: true,
    proxy: {
      // Proxy API calls to the backend server
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/ui/react'),
      '@components': path.resolve(__dirname, 'src/ui/react/components'),
      '@pages': path.resolve(__dirname, 'src/ui/react/pages'),
      '@hooks': path.resolve(__dirname, 'src/ui/react/hooks'),
      '@utils': path.resolve(__dirname, 'src/ui/react/utils'),
      '@types': path.resolve(__dirname, 'src/ui/react/types'),
      '@services': path.resolve(__dirname, 'src/ui/react/services'),
      '@assets': path.resolve(__dirname, 'src/ui/react/assets'),
    }
  }
});