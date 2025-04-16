import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    manifest: true,  // enable manifest generation
    outDir: 'dist',
    rollupOptions: {
      inlineDynamicImports: true,
      input: {
        hedge: resolve(__dirname, './hedge/script.js'),
        mowing: resolve(__dirname, './mowing/script.js'),
        mulching: resolve(__dirname, './mulching/script.js')
      },
      output: {
        entryFileNames: `[name]/[name]-calculator.[hash].js`,
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});



