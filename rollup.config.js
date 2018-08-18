export default [{
  input: 'src/page-metadata.js',
  dest: 'dist/page-metadata.js',
  globals: {
    CEDDL: 'CEDDL'
  },
  output: {
    format: 'umd'
  }
},{
  input: 'src/page-ready.js',
  dest: 'dist/page-ready.js',
  globals: {
    CEDDL: 'CEDDL'
  },
  output: {
    format: 'umd'
  }
},{
  input: 'src/performance-timing.js',
  dest: 'dist/performance-timing.js',
  globals: {
    CEDDL: 'CEDDL'
  },
  output: {
    format: 'umd'
  }
}];
