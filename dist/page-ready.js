(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PageReady = {}));
})(this, (function (exports) { 'use strict';

    var PageReady = /** @class */ (function () {
        function PageReady(ceddl) {
            var _this = this;
            this._store = {};
            this._listeners = [];
            this.ceddl = ceddl;
            this.setCompleteListener = this.setCompleteListener.bind(this);
            this.isStoreValid = this.isStoreValid.bind(this);
            this._el = document.querySelector('[data-page-ready]');
            this.pageReadySetListeners(this._el ? this._el.getAttribute('data-page-ready') : '');
            this.ceddl.eventbus.on('initialize', function () {
                _this._el = document.querySelector('[data-page-ready]');
                _this.pageReadySetListeners(_this._el ? _this._el.getAttribute('data-page-ready') : '');
            });
        }
        /**
         * The static method to initialize the plugin.
         */
        PageReady.run = function (ceddl) {
            if (!PageReady.instance) {
                PageReady.instance = new PageReady(ceddl);
            }
            return PageReady.instance;
        };
        PageReady.prototype.pageReady = function (callback) {
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
         * Reducer function to check if all keys in the store are set to true.
         * @param {Boolean} acc
         * @param {String} key
         * @returns
         */
        PageReady.prototype.isStoreValid = function (acc, key) {
            return acc && this._store[key];
        };
        /**
         * Helper function that creates event callbacks which set the event as
         * completed on execution, as well as checking whether all keys in the
         * store are true, and dispatch the pageready event should that be the
         * case.
         * @param {String} name Event name to mark as completed on execution.
         * @returns {Function}
         */
        PageReady.prototype.createCompleteCallback = function (name) {
            var _this = this;
            return function (data) {
                _this._store[name] = data;
                var allCallbacksComplete = Object.keys(_this._store).reduce(_this.isStoreValid, true);
                if (allCallbacksComplete) {
                    clearTimeout(_this.pageReadyWarning);
                    _this.ceddl.emitEvent('pageready', _this._store);
                }
            };
        };
        PageReady.prototype.setCompleteListener = function (name) {
            // Keep a reference to the callback so we can remove it from the eventbus.
            var markComplete = this.createCompleteCallback(name);
            this.ceddl.eventbus.once(name, markComplete);
            return {
                name: name,
                markComplete: markComplete
            };
        };
        PageReady.prototype.startWarningTimeout = function () {
            var _this = this;
            if (typeof this.pageReadyWarning !== "undefined") {
                clearTimeout(this.pageReadyWarning);
            }
            this.pageReadyWarning = setTimeout(function () {
                _this.ceddl.emitEvent('pageready', {
                    error: true,
                    msg: 'Failed to complete within 4000 ms'
                });
            }, 4000);
        };
        /**
         * Method to indicate when to fire the pageready event. It takes a collection
         * of event names and waits until all of them have fired at least once before
         * dispatching the pageready event.
         */
        PageReady.prototype.pageReadySetListeners = function (eventNames) {
            var _this = this;
            // Reset the previous state
            this._store = {};
            this._listeners.forEach(function (eventCallback) {
                _this.ceddl.eventbus.off(eventCallback.name, eventCallback.markComplete);
            });
            this._listeners = [];
            // If there is no need to wait for anything dispatch event when the page is ready.
            if (!eventNames || eventNames.length === 0) {
                this.pageReady(function () {
                    _this.ceddl.emitEvent('pageready', _this._store);
                });
                return;
            }
            this.startWarningTimeout();
            if (!Array.isArray(eventNames)) {
                // Split on whitespace and remove empty entries.
                eventNames = eventNames.split(' ').filter(function (value) {
                    return !!value;
                });
            }
            if (this._el) {
                this._el.setAttribute('data-page-ready', eventNames.join(' '));
            }
            // Create the new state
            eventNames.forEach(function (name) {
                _this._store[name] = false;
            });
            this._listeners = eventNames.map(this.setCompleteListener);
        };
        return PageReady;
    }());
    // When ceddl is on the global we auto initialize.
    if (typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
        PageReady.run(window['ceddl']);
    }

    exports.PageReady = PageReady;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
