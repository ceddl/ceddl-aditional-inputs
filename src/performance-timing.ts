export class PerformanceTiming {
    private static instance: PerformanceTiming;
    private ceddl: any;

    /**
     * The static method to initialize the plugin.
     */
    public static run(ceddl): PerformanceTiming {
        if (!PerformanceTiming.instance) {
            PerformanceTiming.instance = new PerformanceTiming(ceddl);
        }

        return PerformanceTiming.instance;
    }

    constructor(ceddl) {
        this.ceddl = ceddl;
        this.createPerformanceModel();
        this.pageReady(() => {
            if (!performance || !performance.getEntriesByType) {
                return;
            } else {
                const checkComplete = setInterval(() => {
                    const perf = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
                    if (perf.domComplete > 0) {
                        clearInterval(checkComplete);
                        ceddl.emitModel('performanceTiming', this.getPerformanceTimingData(perf));
                    }
                }, 500);
            }
        });
    }

    pageReady(callback) {
        let isReady;
        // @ts-ignore
        if (document.attachEvent) {
            isReady = document.readyState === "complete";
        } else {
            isReady = document.readyState !== "loading";
        }

        if (isReady) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    /**
     * Calculating steps in the page loading pipeline.
     * @return {Object} PerformanceObj containg performance metrics
     */
    getPerformanceTimingData(perf) {
        const PerformanceObj: any = {
            'redirecting': perf.fetchStart - perf.startTime,
            'dnsconnect': perf.requestStart - perf.fetchStart,
            'request': perf.responseStart - perf.requestStart,
            'response': perf.responseEnd - perf.responseStart,
            'domprocessing': perf.domComplete - perf.responseEnd,
            'load': perf.loadEventEnd - perf.loadEventStart
        };

        /**
         * Obtaining the transferred kb of resources inluding estimated document size.
         */
        if (window.performance && window.performance.getEntriesByType) {
            let resource;
            const resources = window.performance.getEntriesByType('resource');
            const documentSize = unescape(encodeURIComponent(document.documentElement.innerHTML)).length / 4.2;
            let byteTotal = 0;
            for (let i = 0; i < resources.length; i++) {
                resource = resources[i];
                byteTotal = byteTotal + resource.transferSize;
            }
            PerformanceObj.transferbytes = byteTotal + Math.round(documentSize);
            PerformanceObj.transferrequests = resources.length + 1;
        }

        return PerformanceObj;
    }

    createPerformanceModel() {
        this.ceddl.modelFactory.create({
            key: 'performanceTiming',
            fields: {
                redirecting: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: true,
                },
                dnsconnect: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: true,
                },
                request: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: true,
                },
                response: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: true,
                },
                domprocessing: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: true,
                },
                load: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: true,
                },
                transferbytes: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: false,
                },
                transferrequests: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: false,
                },
            }
        });
    }
}
// When ceddl is on the global we auto initialize.
if(typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
    PerformanceTiming.run(window['ceddl']);
}