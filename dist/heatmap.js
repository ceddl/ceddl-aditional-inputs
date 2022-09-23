(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Heatmap = {}));
})(this, (function (exports) { 'use strict';

    var Heatmap = /** @class */ (function () {
        function Heatmap(ceddl) {
            this.coordinates = [];
            // @ts-ignore
            this.windowWidth = Math.round(parseInt(window.innerWidth, 10));
            // collection throttle
            this.trackData = false;
            this.isMouseUser = false;
            this.movement = 0;
            this.movementOkcount = 0;
            this.ceddl = ceddl;
            this.startIdle = this.startIdle.bind(this);
            this.emitHeatmapCoordinates = this.emitHeatmapCoordinates.bind(this);
            this.setListeners();
        }
        /**
         * The static method to initialize the plugin.
         */
        Heatmap.run = function (ceddl) {
            if (!Heatmap.instance) {
                Heatmap.instance = new Heatmap(ceddl);
            }
            return Heatmap.instance;
        };
        /**
         * Only use the mousemove data if the user
         * is actualy using a mouse. This can be hard
         * to detect. If you have a inproved sollution
         * please do not hesitate to contact
         * ceddl-polyfill team or create a pull
         * request.
         */
        Heatmap.prototype.DetectMouseUser = function (event) {
            var _this = this;
            if (this.isMouseUser) {
                // collection throttle interval.
                setInterval(function () {
                    _this.trackData = true;
                }, 50);
                return true;
            }
            var current = this.movement;
            if (this.x && this.y) {
                this.movement = this.movement + Math.abs(this.x - event.pageX) + Math.abs(this.y - event.pageY);
            }
            this.x = event.pageX;
            this.y = event.pageY;
            if ((current + 10) > this.movement) {
                this.movementOkcount++;
            }
            if (this.movementOkcount > 5) {
                this.isMouseUser = true;
            }
            return false;
        };
        /**
         * As the mouse stops moving the stream of events stop.
         * The user is deciding or reading text?! For 10 intervals
         * continue to add the position to the coordinates.
         */
        Heatmap.prototype.startIdle = function () {
            var _this = this;
            var idleCount = 0;
            var idle = function () {
                _this.coordinates.push({
                    t: 1,
                    x: _this.lastX,
                    y: _this.lastY
                });
                idleCount++;
                if (idleCount > 10) {
                    clearInterval(_this.idleInterval);
                }
            };
            idle();
            this.idleInterval = setInterval(idle, 1000);
        };
        /**
         * Send data to ceddl and clear the current coordinates.
         */
        Heatmap.prototype.emitHeatmapCoordinates = function () {
            if (this.coordinates.length > 0) {
                this.ceddl.emitEvent('heatmap:update', {
                    width: this.windowWidth,
                    coordinates: this.coordinates.splice(0, this.coordinates.length)
                });
            }
            // @ts-ignore
            this.windowWidth = Math.round(parseInt(window.innerWidth, 10));
        };
        /**
         * Determines if the element is a valid element to stop the delegation loop and
         * emit the coordinates dataset.
         */
        Heatmap.prototype.isClickTarget = function (element) {
            return element.hasAttribute('ceddl-click') ||
                (element.nodeType === 1 && element.tagName.toUpperCase() === 'BUTTON') ||
                (element.nodeType === 1 && element.tagName.toUpperCase() === 'A');
        };
        /**
         * A deligation loop to find the clicked element and execute click callback
         * with that element.
         */
        Heatmap.prototype.delegate = function (callback, el) {
            var currentElement = el;
            do {
                if (!this.isClickTarget(currentElement))
                    continue;
                callback(currentElement);
                return;
            } while (currentElement.nodeName.toUpperCase() !== 'BODY' && (currentElement = currentElement.parentNode));
        };
        Heatmap.prototype.setListeners = function () {
            var _this = this;
            document.addEventListener('mousemove', function (ev) {
                if (_this.DetectMouseUser(ev)) {
                    if (_this.idleTimeout)
                        clearTimeout(_this.idleTimeout);
                    if (_this.idleInterval)
                        clearInterval(_this.idleInterval);
                    if (_this.trackData) {
                        _this.lastX = ev.pageX;
                        _this.lastY = ev.pageY;
                        _this.coordinates.push({
                            t: 1,
                            x: _this.lastX,
                            y: _this.lastY
                        });
                        _this.trackData = false;
                    }
                    _this.idleTimeout = setTimeout(_this.startIdle, 500);
                }
            });
            /**
             * Be sure to collect data if when the user closes the tab
             * or exits the browser window. Also prevent idle user
             * collection in this scenario.
             */
            document.body.addEventListener('mouseleave', function () {
                if (_this.idleInterval) {
                    clearTimeout(_this.idleTimeout);
                    clearInterval(_this.idleInterval);
                    _this.emitHeatmapCoordinates();
                }
            });
            /**
             * Store the mousedown position in the coordinates array.
             * If Clicked on a button or a link emit data.
             */
            document.body.addEventListener('mousedown', function (ev) {
                _this.coordinates.push({
                    t: 2,
                    x: ev.pageX,
                    y: ev.pageY
                });
                _this.delegate(_this.emitHeatmapCoordinates, ev.target);
            });
            /**
             * Emit data on end of resize event because the width
             * of the frame changed and the layout probably different.
             */
            var resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    _this.emitHeatmapCoordinates();
                }, 300);
            });
        };
        return Heatmap;
    }());
    // When ceddl is on the global we auto initialize.
    if (typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
        Heatmap.run(window['ceddl']);
    }

    exports.Heatmap = Heatmap;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
