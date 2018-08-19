var static = require('node-static');
var rollup = require('rollup');
var fileServer = new static.Server('./demo');
var distServer = new static.Server('./dist');

var watchOptions = [{
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

var watcher = rollup.watch(watchOptions);
watcher.on('event', event => {
  console.log('ROLLUP: ' + event.code);
  if (event.code === 'ERROR' || event.code === 'FATAL') {
    console.log(event);
  }
});


require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        if(
            request.url.includes('page-metadata.js') ||
            request.url.includes('page-ready.js') ||
            request.url.includes('performance-timing.js')
        ) {
            distServer.serve(request, response);
        } else {
            fileServer.serve(request, response);
        }
    }).resume();
}).listen(8080);

console.log('Navigate to http://localhost:8080/');
