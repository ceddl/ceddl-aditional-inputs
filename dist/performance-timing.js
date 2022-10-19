(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PerformanceTiming = {}));
})(this, (function (exports) { 'use strict';

    var PerformanceTiming = /** @class */ (function () {
        function PerformanceTiming(ceddl) {
            var _this = this;
            this.ceddl = ceddl;
            this.createPerformanceModel();
            this.pageReady(function () {
                if (!performance || !performance.getEntriesByType) {
                    return;
                }
                else {
                    var checkComplete_1 = setInterval(function () {
                        var perf = performance.getEntriesByType("navigation")[0];
                        if (perf.domComplete > 0) {
                            clearInterval(checkComplete_1);
                            ceddl.emitModel('performanceTiming', _this.getPerformanceTimingData(perf));
                        }
                    }, 500);
                }
            });
        }
        /**
         * The static method to initialize the plugin.
         */
        PerformanceTiming.run = function (ceddl) {
            if (!PerformanceTiming.instance) {
                PerformanceTiming.instance = new PerformanceTiming(ceddl);
            }
            return PerformanceTiming.instance;
        };
        PerformanceTiming.prototype.pageReady = function (callback) {
            var isReady;
            // @ts-ignore
            if (document.attachEvent) {
                isReady = document.readyState === "complete";
            }
            else {
                isReady = document.readyState !== "loading";
            }
            if (isReady) {
                callback();
            }
            else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        };
        /**
         * Calculating steps in the page loading pipeline.
         * @return {Object} PerformanceObj containg performance metrics
         */
        PerformanceTiming.prototype.getPerformanceTimingData = function (perf) {
            var PerformanceObj = {
                'redirecting': Math.round(perf.fetchStart - perf.startTime),
                'dnsconnect': Math.round(perf.requestStart - perf.fetchStart),
                'request': Math.round(perf.responseStart - perf.requestStart),
                'response': Math.round(perf.responseEnd - perf.responseStart),
                'domprocessing': Math.round(perf.domComplete - perf.responseEnd),
                'load': Math.round(perf.loadEventEnd - perf.loadEventStart)
            };
            /**
             * Obtaining the transferred kb of resources inluding estimated document size.
             */
            if (window.performance && window.performance.getEntriesByType) {
                var resource = void 0;
                var resources = window.performance.getEntriesByType('resource');
                var documentSize = unescape(encodeURIComponent(document.documentElement.innerHTML)).length / 4.2;
                var byteTotal = 0;
                for (var i = 0; i < resources.length; i++) {
                    resource = resources[i];
                    byteTotal = byteTotal + resource.transferSize;
                }
                PerformanceObj.transferbytes = byteTotal + Math.round(documentSize);
                PerformanceObj.transferrequests = resources.length + 1;
            }
            return PerformanceObj;
        };
        PerformanceTiming.prototype.createPerformanceModel = function () {
            this.ceddl.modelFactory.create({
                key: 'performanceTiming',
                fields: {
                    redirecting: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: true
                    },
                    dnsconnect: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: true
                    },
                    request: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: true
                    },
                    response: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: true
                    },
                    domprocessing: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: true
                    },
                    load: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: true
                    },
                    transferbytes: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: false
                    },
                    transferrequests: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: false
                    }
                }
            });
        };
        return PerformanceTiming;
    }());
    // When ceddl is on the global we auto initialize.
    if (typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
        PerformanceTiming.run(window['ceddl']);
    }

    exports.PerformanceTiming = PerformanceTiming;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
