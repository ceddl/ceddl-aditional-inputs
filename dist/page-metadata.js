(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PageMetadata = {}));
})(this, (function (exports) { 'use strict';

    var PageMetadata = /** @class */ (function () {
        function PageMetadata(ceddl) {
            var _this = this;
            this.ceddl = ceddl;
            this.createPageMetadataModel();
            this.pageReady(function () {
                _this.ceddl.emitModel('pageMetadata', _this.getPageMeta());
                _this.setListeners();
            });
        }
        /**
         * The static method to initialize the plugin.
         */
        PageMetadata.run = function (ceddl) {
            if (!PageMetadata.instance) {
                PageMetadata.instance = new PageMetadata(ceddl);
            }
            return PageMetadata.instance;
        };
        PageMetadata.prototype.pageReady = function (callback) {
            /**
             * Prevent errors in server side prerendering applications.
             */
            if (typeof document === 'undefined') {
                return;
            }
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
         * detects if the browser has Cookies enabled.
         * @return {Boolean} ret
         */
        PageMetadata.prototype.hasCookies = function () {
            if (navigator.cookieEnabled) {
                return true;
            }
            document.cookie = "cookietest=1";
            var ret = document.cookie.indexOf("cookietest=") != -1;
            document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return ret;
        };
        PageMetadata.prototype.setListeners = function () {
            var _this = this;
            window.addEventListener('hashchange', function () {
                _this.ceddl.emitModel('pageMetadata', _this.getPageMeta());
            });
            this.ceddl.eventbus.on('initialize', function () {
                _this.ceddl.emitModel('pageMetadata', _this.getPageMeta());
            });
        };
        PageMetadata.prototype.createPageMetadataModel = function () {
            this.ceddl.modelFactory.create({
                key: 'pageMetadata',
                fields: {
                    url: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    path: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    referrer: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    title: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    url_section: {
                        type: this.ceddl.modelFactory.fields.ArrayField,
                        fieldType: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    cookie: {
                        type: this.ceddl.modelFactory.fields.BooleanField,
                        required: false
                    },
                    touch: {
                        type: this.ceddl.modelFactory.fields.BooleanField,
                        required: false
                    },
                    device_pixel_ratio: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: false
                    },
                    resolution: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    width: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: false
                    },
                    height: {
                        type: this.ceddl.modelFactory.fields.NumberField,
                        required: false
                    },
                    query_string: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    hash: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    }
                }
            });
        };
        PageMetadata.prototype.detectFeatures = function () {
            if (this.features) {
                return this.features;
            }
            var devicePixelRatio = window.devicePixelRatio || 1;
            var cookie = this.hasCookies();
            // @ts-ignore
            var touch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
            // @ts-ignore
            var width = Math.round(parseInt(screen.width, 10) * devicePixelRatio);
            // @ts-ignore
            var height = Math.round(parseInt(screen.height, 10) * devicePixelRatio);
            var resolution = width + 'x' + height;
            this.features = {
                cookie: cookie,
                touch: touch,
                device_pixel_ratio: (Math.round(devicePixelRatio * 1000) / 1000).toFixed(3),
                resolution: resolution,
                width: width,
                height: height
            };
            return this.features;
        };
        /**
         * getPageState is a helper function to collect all the browser and custom element data
         * converting it into the page data object.
         */
        PageMetadata.prototype.getPageMeta = function () {
            var data = this.detectFeatures();
            data.title = document.title;
            data.url = window.location.href;
            data.path = document.location.pathname;
            data.referrer = document.referrer;
            data.url_section = window.location.pathname.split('/').filter(function (part) {
                return part.length !== 0;
            }).map(function (part) {
                return part.replace(/\.[^/.]+$/, "");
            });
            data.hash = window.location.hash;
            data.query_string = window.location.search;
            return data;
        };
        return PageMetadata;
    }());
    // When ceddl is on the global we auto initialize.
    if (typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
        PageMetadata.run(window['ceddl']);
    }

    exports.PageMetadata = PageMetadata;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
