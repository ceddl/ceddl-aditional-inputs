import typescript from '@rollup/plugin-typescript';

export default [{
  input: 'src/page-metadata.ts',
  plugins: [typescript()],
  output: {
    name: 'PageMetadata',
    file: 'dist/page-metadata.js',
    format: 'umd'
  }
},{
  input: 'src/page-ready.ts',
  plugins: [typescript()],
  output: {
    name: 'PageReady',
    file: 'dist/page-ready.js',
    format: 'umd'
  }
},{
  input: 'src/performance-timing.ts',
  plugins: [typescript()],
  output: {
    name: 'PerformanceTiming',
    file: 'dist/performance-timing.js',
    format: 'umd'
  }
},{
  input: 'src/heatmap.ts',
  plugins: [typescript()],
  output: {
    name: 'Heatmap',
    file: 'dist/heatmap.js',
    format: 'umd',
  }
},{
  input: 'src/urchin-tracking.ts',
  plugins: [typescript()],
  output: {
    name: 'UrchinTracking',
    file: 'dist/urchin-tracking.js',
    format: 'umd',
  }
}];
