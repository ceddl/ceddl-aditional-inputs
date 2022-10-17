var staticServer = require('node-static');
var rollup = require('rollup');
const typescript = require("@rollup/plugin-typescript")

var watchOptions =  [{
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

var fileServer = new staticServer.Server('./demo');
var distServer = new staticServer.Server('./dist');
var modulesServer = new staticServer.Server('./');

var watcher = rollup.watch(watchOptions);
watcher.on('event', event => {
  console.log('ROLLUP: ' + event.code);
  if (event.code === 'ERROR' || event.code === 'FATAL') {
    console.log(event);
  }
});


require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        if (request.url.includes('node_modules') ) {
            modulesServer.serve(request, response);
        } else if(
            request.url.includes('page-metadata.js') ||
            request.url.includes('page-ready.js') ||
            request.url.includes('performance-timing.js') ||
            request.url.includes('heatmap.js') ||
            request.url.includes('urchin-tracking.js')
        ) {
            distServer.serve(request, response);
        } else {
            fileServer.serve(request, response);
        }
    }).resume();
}).listen(8080);

console.log('Navigate to http://localhost:8080/');
