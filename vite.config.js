// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      inlineDynamicImports: true,
      input: {
        hedge:       resolve(__dirname, './hedge/script.js'),
        mowing:      resolve(__dirname, './mowing/script.js'),
        yardDirt:    resolve(__dirname, './yard‑dirt/script.js'),  // renamed key!
        mulching:    resolve(__dirname, './mulching/script.js')
      },
      output: {
        entryFileNames:   `[name]/[name]-calculator.[hash].js`,
        chunkFileNames:   'chunks/[name]-[hash].js',
        assetFileNames:   'assets/[name]-[hash].[ext]'
      }
    }
  }
});





