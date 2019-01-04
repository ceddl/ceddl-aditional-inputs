export default [{
  input: 'src/page-metadata.js',
  output: {
    file: 'dist/page-metadata.js',
    globals: {
      ceddl: 'ceddl'
    },
    format: 'umd'
  }
},{
  input: 'src/page-ready.js',
  output: {
    file: 'dist/page-ready.js',
    globals: {
      ceddl: 'ceddl'
    },
    format: 'umd'
  }
},{
  input: 'src/performance-timing.js',
  output: {
    file: 'dist/performance-timing.js',
    globals: {
      ceddl: 'ceddl'
    },
    format: 'umd'
  }
},{
  input: 'src/heatmap.js',
  output: {
    file: 'dist/heatmap.js',
    globals:  {
      ceddl: 'ceddl'
    },
    format: 'umd'
  }
}];
