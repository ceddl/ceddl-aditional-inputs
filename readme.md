# @ceddl/ceddl-aditional-inputs

📦 aditional inputs for the ceddl polyfill

> This package is not included in the spec and not part of th ceddl polyfill.

```
npm install@ceddl/ceddl-aditional-inputs
```

<h2 align="center">Introduction</h2>

This aditional input repository for ceddl polyfill shows how to create custom inputs. We aim to provide plug and play solutions to common input requirements.

### Available inputs

1. page-metadata
2. page-ready
3. performance-timing
4. heatmap

### Plugin Install

```html
/** Using html script tags */
<script src="/node_modules/@ceddl/ceddl-polyfill/dist/index.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/page-metadata.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/performance-timing.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/page-ready.js"></script>
<script src="/node_modules/@ceddl/ceddl-aditional-inputs/dist/heatmap"></script>
```
```js
/** Using Javascript or typescript imports */
import {ceddl} from '@ceddl/ceddl-polyfill'
import {PageMetadata} from '@ceddl/ceddl-aditional-inputs/dist/page-metadata'
import {PageReady} from '@ceddl/ceddl-aditional-inputs/dist/page-ready'
import {Heatmap} from '@ceddl/ceddl-aditional-inputs/dist/heatmap'
import {PerformanceTiming} from '@ceddl/ceddl-aditional-inputs/dist/performance-timing'

PageReady.run(ceddl);
PageMetadata.run(ceddl);
Heatmap.run(ceddl);
PerformanceTiming.run(ceddl);
```

### Looking for pull requests

1. Improve documentation for each input.
2. Typing for eslint "Unexpected any" warnings 

<h2 align="center">development</h2>

```
npm install
npm run dev
```

This will start the development server on  http://localhost:8080/

<h2 align="center">License</h2>

ceddl-aditional-inputs is [MIT licensed]()

<h2 align="center">CEDDL-polyfill</h2>
Customer experience digital data layer polyfill. Bridging the gap between the ceddl spec's and the browsers.
For more information please visit https://www.ceddlbyexample.com/
