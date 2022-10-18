# @ceddl/ceddl-aditional-inputs

📦 Additional inputs for the ceddl polyfill

```
npm install@ceddl/ceddl-aditional-inputs
```

## Introduction

This additional input repository for Ceddl-polyfill contains plugins. You will find solutions to common data acquisition requirements. Allowing businesses to take back control of their analytics and marketing data footprint. Do not hesitate to provide us with an excellent input solution of your own!

### Install

```html
<!--Using html script tags-->
<script src="/node_modules/@ceddl/ceddl-polyfill/dist/index.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/page-metadata.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/performance-timing.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/page-ready.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/heatmap.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/urchin-tracking.js"></script>
```
```js
/** Using Javascript or typescript imports */
import {ceddl} from '@ceddl/ceddl-polyfill';
import {PageMetadata} from '@ceddl/ceddl-aditional-inputs/dist/page-metadata';
import {PageReady} from '@ceddl/ceddl-aditional-inputs/dist/page-ready';
import {Heatmap} from '@ceddl/ceddl-aditional-inputs/dist/heatmap';
import {PerformanceTiming} from '@ceddl/ceddl-aditional-inputs/dist/performance-timing';
import {UrchinTracking} from '@ceddl/ceddl-aditional-inputs/dist/urchin-tracking';


PageReady.run(ceddl);
PageMetadata.run(ceddl);
Heatmap.run(ceddl);
PerformanceTiming.run(ceddl);
UrchinTracking.run(ceddl);
```


### Plugin page-metadata

This plugin collects primary browser & page information. The resulting set is often combined with other events to do segmentation.

```js
ceddl.eventbus.on('pageMetadata', function (data) {
  console.log(data);
});

// "pageMetadata": {
  // "url": "http://localhost:8080/?foo=true#bar"
  // "path": "/"
  // "referrer": ""
  // "title": "CEDDL-polyfill - Bridging the gap between the spec and the browsers"
  // "url_section": []
  // "cookie": true
  // "touch": false
  // "device_pixel_ratio": 1
  // "resolution": "1920x1080"
  // "width": 1920
  // "height": 1080
  // "query_string": "?foo=true"
  // "hash": "#bar"
// }
```

### Plugin page-ready

This plugin collects multiple events and then signals one time when the page is ready. For example, waiting on the user page authentication or products displayed

```html
<body data-page-ready="pageMetadata user products"> </body>
```

```js
ceddl.eventbus.on('pageready', function (data) {
  console.log(data);
});
```

### Plugin performance-timing

This plugin gathers metrics regarding document navigation. For example, this interface can be used to determine how much time it took to load the page for a group of users/device types.

```js
ceddl.eventbus.on('performanceTiming', function (data) {
  console.log(data);
});

// "performanceTiming": {
//     "redirecting": 2
//     "dnsconnect": 18
//     "request": 2
//     "response": 5
//     "domprocessing": 525
//     "load": 50
//     "transferbytes": 366533
//     "transferrequests": 37
// }
```

### Plugin heatmap

A heat map is a data visualization technique showing where user groups click, scroll, and move on the page.
A visualization example is embedded in our development setup or go to the [Heatmap Blog Post](https://www.ceddlbyexample.com/blog/2019-01-04-heatmap-input-checked-off-on-the-bucket-list/?utm_source=github&utm_medium=readme&utm_campaign=main&utm_content=a02)

```js
ceddl.eventbus.on('heatmap:update', function (data) {
  console.log(data);
});
```

### Plugin urchin tracking

UTM or Urchin Tracking Module is a method to measure which campaigns and links are and aren't working. Unique codes at the end of URL(links) contain parameters that let you accurately determine the origin, the impact of your campaigns and see which marketing initiatives are gaining traction.

Government and web standards organizations are under pressure to do more for citizen's data privacy. To this end, the HTTP referrer property and possibly these UTM properties can be blocked. This plugin for Ceddl-polyfill allows you to change the prefix of the parameters if needed. We also advise using link shorteners.

```js 
import {ceddl} from '@ceddl/ceddl-polyfill';
import {UrchinTracking} from '@ceddl/ceddl-aditional-inputs/dist/urchin-tracking';

UrchinTracking.run(ceddl, 'utm');
ceddl.eventbus.on('hurchinTracking', function (data) {
  console.log(data);
});

// "urchinTracking": {
//   "id": "email12"
//   "source": "hubspot"
//   "medium": "email"
//   "campaign": "main"
//   "content": "A123"
//   "term": "main"
// }
```

### On the roadmap

1. Reading Behavior.
2. In viewport observer. (Maybe part of polyfill)

### Looking for pull requests

1. Typing solution for eslint "Unexpected any" warnings 

## development

```
npm install
npm run dev
```

Will start the development server on  http://localhost:8080/

## License

ceddl-aditional-inputs has a MIT open source license.

## CEDDL-polyfill
Customer experience digital data layer polyfill. Enable business to take back control of their analytics and marketing data footprint.
For more information, please visit [https://www.ceddlbyexample.com/](https://www.ceddlbyexample.com/?utm_source=github&utm_medium=readme&utm_campaign=main&utm_content=a01)
