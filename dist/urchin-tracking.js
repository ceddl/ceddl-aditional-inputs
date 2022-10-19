(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UrchinTracking = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * No official standard for this tracking method. Is widely used and therefor
     * proposed as a plugin for ceddl. see UTM Builders guides.
     * https://search.brave.com/search?q=utm+builders&source=web
     */
    var UrchinTracking = /** @class */ (function () {
        function UrchinTracking(ceddl, options) {
            this.ceddl = ceddl;
            this.createUrchinModel();
            // No ie11 support.
            if (URLSearchParams) {
                var urchinArray = this.getUrchinData(options);
                // Move from array to object based model without assigning variables.
                if (urchinArray.length > 0) {
                    this.removeUrchinFromUrl(urchinArray, options);
                    ceddl.emitModel('urchinTracking', __assign(__assign({}, urchinArray.reduce(function (accumulator, value) {
                        var _a;
                        return __assign(__assign({}, accumulator), (_a = {}, _a[value[0]] = value[1], _a));
                    }, {})), {}));
                }
            }
        }
        /**
         * The static method to initialize the plugin.
         */
        UrchinTracking.run = function (ceddl, options) {
            if (!UrchinTracking.instance) {
                UrchinTracking.instance = new UrchinTracking(ceddl, options);
            }
            return UrchinTracking.instance;
        };
        /**
         *   Urchin Tracking Module (UTM) parameters from the url
         *   and removing the prefixes from the modelkeys
         */
        UrchinTracking.prototype.getUrchinData = function (options) {
            var prefix = !options || !options.prefix ? 'utm' : options.prefix;
            var searchParams = new URLSearchParams(window.location.search);
            return Array.from(searchParams).filter(function (utms) {
                return utms[0].startsWith("".concat(prefix, "_"));
            }).map(function (utms) {
                return [utms[0].replace(new RegExp(prefix + '_', 'i'), ''), utms[1]];
            });
        };
        UrchinTracking.prototype.removeUrchinFromUrl = function (urchinArray, options) {
            var prefix = !options || !options.prefix ? 'utm' : options.prefix;
            var removeOnLoad = !options || options.prefix === true ? true : false;
            var parsedUrl = new URL(window.location.href);
            var urlParams = parsedUrl.searchParams;
            if (!urlParams) {
                return window.location.href;
            }
            if (removeOnLoad) {
                urchinArray.forEach(function (value) {
                    urlParams["delete"]("".concat(prefix, "_").concat(value[0]));
                });
            }
            var previousState = history.state;
            history.replaceState(previousState, '', parsedUrl.toString());
        };
        UrchinTracking.prototype.createUrchinModel = function () {
            this.ceddl.modelFactory.create({
                key: 'urchinTracking',
                fields: {
                    source: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: true
                    },
                    medium: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: true
                    },
                    campaign: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    content: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    },
                    term: {
                        type: this.ceddl.modelFactory.fields.StringField,
                        required: false
                    }
                }
            });
        };
        return UrchinTracking;
    }());
    // When ceddl is on the global we auto initialize.
    if (typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
        UrchinTracking.run(window['ceddl'], window['urchinOptions']);
    }

    exports.UrchinTracking = UrchinTracking;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
