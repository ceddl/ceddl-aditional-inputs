var static = require('node-static');
var rollup = require('rollup');
var watchOptions =  [{
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
;
var fileServer = new static.Server('./demo');
var distServer = new static.Server('./dist');
var modulesServer = new static.Server('./');

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
            request.url.includes('heatmap.js')
        ) {
            distServer.serve(request, response);
        } else {
            fileServer.serve(request, response);
        }
    }).resume();
}).listen(8080);

console.log('Navigate to http://localhost:8080/');
