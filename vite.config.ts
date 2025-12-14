import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative base path to ensure assets are loaded correctly
  base: './',
  build: {
    // Configure Rollup to treat these imports as external.
    // This prevents Vite from trying to bundle them (which would fail if they aren't installed locally)
    // and instead leaves the import statements intact for the browser to resolve via index.html's importmap.
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'lucide-react',
        'pptxgenjs',
        '@google/genai'
      ]
    }
  },
  // Define global constants to replace variables during the build.
  // This polyfills `process.env` which is not available in the browser.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': {} 
  }
});