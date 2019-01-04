(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ceddl')) :
    typeof define === 'function' && define.amd ? define(['ceddl'], factory) :
    (factory(global.ceddl));
}(this, (function (ceddl) { 'use strict';

    ceddl = ceddl && ceddl.hasOwnProperty('default') ? ceddl['default'] : ceddl;

    (function() {

        var coordinates = [];
        var windowWidth = Math.round(parseInt(window.innerWidth, 10));

        // collection throttle
        var trackData = false;

        var idleTimeout, idleInterval;
        var lastX, lastY;

        var isMouseUser = false;
        var movement = 0;
        var movementOkcount = 0;
        var x, y;

        /**
         * Only use the mousemove data if the user
         * is actualy using a mouse. This can be hard
         * to detect. If you have a inproved sollution
         * please do not hesitate to contact
         * ceddl-polyfill team or create a pull
         * request.
         */
        function DetectMouseUser(event) {
            if(isMouseUser) {
                // collection throttle interval.
                setInterval(function() {
                    trackData = true;
                }, 50);
                return true;
            }
            let current = movement;
            if(x && y){
                movement = movement + Math.abs(x - event.pageX) + Math.abs(y - event.pageY);
            }
            x = event.pageX;
            y = event.pageY;
            if ((current + 10) > movement) {
                movementOkcount++;
            }
            if(movementOkcount > 5) {
                isMouseUser = true;
            }
            return false;
        }

        /**
         * As the mouse stops moving the stream of events stop.
         * The user is deciding or reading text?! For 10 intervals
         * continue to add the position to the coordinates.
         */
        function startIdle() {
            var idleCount = 0;

            function idle() {

                coordinates.push({
                    t: 1,
                    x: lastX,
                    y: lastY
                });
                idleCount++;
                if (idleCount > 10) {
                    clearInterval(idleInterval);
                }
            }
            idle();
            idleInterval = setInterval(idle, 1000);
        }

        /**
         * Send data to ceddl and clear the current coordinates.
         */
        function emitHeatmapCoordinates() {
            if(coordinates.length > 0) {
                ceddl.emitEvent('heatmap:update', {
                    width: windowWidth,
                    coordinates: coordinates.splice(0, coordinates.length)
                });
            }
            windowWidth = Math.round(parseInt(window.innerWidth, 10));
        }

        /**
         * Determines if the element is a valid element to stop the delegation loop and
         * emit the coordinates dataset.
         */
        function isClickTarget(element) {
            return element.hasAttribute('ceddl-click') ||
                   (element.nodeType === 1 && element.tagName.toUpperCase() === 'BUTTON') ||
                   (element.nodeType === 1 && element.tagName.toUpperCase() === 'A');
        }

        /**
         * A deligation loop to find the clicked element and execute click callback
         * with that element.
         */
        function delegate(callback, el) {
            var currentElement = el;

            do {
                if (!isClickTarget(currentElement)) continue;
                callback(currentElement);
                return;
            } while(currentElement.nodeName.toUpperCase() !== 'BODY' && (currentElement = currentElement.parentNode));
        }


        function setListeners () {
            document.addEventListener('mousemove', function(ev) {
                if(DetectMouseUser(ev)) {
                    if (idleTimeout) clearTimeout(idleTimeout);
                    if (idleInterval) clearInterval(idleInterval);
                    if (trackData) {
                        lastX = ev.pageX;
                        lastY = ev.pageY;
                        coordinates.push({
                            t: 1,
                            x: lastX,
                            y: lastY
                        });
                        trackData = false;
                    }
                    idleTimeout = setTimeout(startIdle, 500);
                }
            });

            /**
             * Be sure to collect data if when the user closes the tab
             * or exits the browser window. Also prevent idle user
             * collection in this scenario.
             */
            document.body.addEventListener('mouseleave', function() {
                if(idleInterval) {
                    clearTimeout(idleTimeout);
                    clearInterval(idleInterval);
                    emitHeatmapCoordinates();
                }
            });

            /**
             * Store the mousedown position in the coordinates array.
             * If Clicked on a button or a link emit data.
             */
            document.body.addEventListener('mousedown', function(ev) {
                coordinates.push({
                    t: 2,
                    x: ev.pageX,
                    y: ev.pageY
                });
                delegate(emitHeatmapCoordinates, ev.target);
            });


            /**
             * Emit data on end of resize event because the width
             * of the frame changed and the layout probably different.
             */
            var resizeTimer;
            window.addEventListener('resize', function() {
                 clearTimeout(resizeTimer);
                 resizeTimer = setTimeout(function() {
                    emitHeatmapCoordinates();
                  }, 300);
            });
        }

        setListeners();

    })();

})));
