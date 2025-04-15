export default {
    build: {
      outDir: 'public',
      rollupOptions: {
        input: {
          hedge: './hedge/hedge-calculator.js',
          lawn: './lawn/lawn-calculator.js',
          mulch: './mulch/mulch-calculator.js',
        },
        output: {
          entryFileNames: '[name]/[name]-calculator.js'
        }
      }
    }
  }