import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    manifest: true,
    outDir: 'dist',
    // explicitly enable minification
    minify: 'esbuild',       // super-fast, default in Vite
    // minify: 'terser',      // use this instead if you need advanced terser options
    // terserOptions: {
    //   compress: { passes: 2 },
    //   mangle: true,
    //   format: { comments: false }
    // },
    rollupOptions: {
      inlineDynamicImports: true,
      input: {
        hedge:       resolve(__dirname, './hedge/script.js'),
        mowing:      resolve(__dirname, './mowing/script.js'),
        yardDirt:    resolve(__dirname, './yard-dirt/script.js'),
        mulching:    resolve(__dirname, './mulching/script.js'),
        fencing:    resolve(__dirname, './fencing/script.js'),
        'concrete-demolition': resolve(__dirname, './concrete-demolition/script.js'),
        'concrete-driveway':   resolve(__dirname, './concrete-driveway/script.js'),
        'asphalt-driveway':    resolve(__dirname, './asphalt-driveway/script.js')
      },
      output: {
        entryFileNames:   `[name]/[name]-calculator.[hash].js`,
        chunkFileNames:   'chunks/[name]-[hash].js',
        assetFileNames:   'assets/[name]-[hash].[ext]'
      }
    }
  }
});






