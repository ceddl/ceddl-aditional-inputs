export class Heatmap {
    private static instance: Heatmap;
    private ceddl: any;


    private coordinates = [];
    // @ts-ignore
    private windowWidth = Math.round(parseInt(window.innerWidth, 10));

    // collection throttle
    private trackData = false;

    private idleTimeout: any;
    private idleInterval: any;
    private lastX: any;
    private lastY: any;
    private isMouseUser = false;
    private movement = 0;
    private movementOkcount = 0;
    private x: number;
    private y: number;

    /**
     * The static method to initialize the plugin.
     */
    public static run(ceddl): Heatmap {
        if (!Heatmap.instance) {
            Heatmap.instance = new Heatmap(ceddl);
        }

        return Heatmap.instance;
    }

    constructor(ceddl) {
        this.ceddl = ceddl;
        this.startIdle = this.startIdle.bind(this);
        this.emitHeatmapCoordinates = this.emitHeatmapCoordinates.bind(this);
        this.setListeners();
    }


    /**
     * Only use the mousemove data if the user
     * is actualy using a mouse. This can be hard
     * to detect. If you have a inproved sollution
     * please do not hesitate to contact
     * ceddl-polyfill team or create a pull
     * request.
     */
    DetectMouseUser(event) {
        if (this.isMouseUser) {
            // collection throttle interval.
            setInterval(() => {
                this.trackData = true;
            }, 50);
            return true;
        }
        const current = this.movement;
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
    }

    /**
     * As the mouse stops moving the stream of events stop.
     * The user is deciding or reading text?! For 10 intervals
     * continue to add the position to the coordinates.
     */
    startIdle() {
        let idleCount = 0;

        const idle = () => {

            this.coordinates.push({
                t: 1,
                x: this.lastX,
                y: this.lastY
            });
            idleCount++;
            if (idleCount > 10) {
                clearInterval(this.idleInterval);
            }
        }

        idle();
        this.idleInterval = setInterval(idle, 1000);
    }

    /**
     * Send data to ceddl and clear the current coordinates.
     */
    emitHeatmapCoordinates() {
        if (this.coordinates.length > 0) {
            this.ceddl.emitEvent('heatmap:update', {
                width: this.windowWidth,
                coordinates: this.coordinates.splice(0, this.coordinates.length)
            });
        }
        // @ts-ignore
        this.windowWidth = Math.round(parseInt(window.innerWidth, 10));
    }

    /**
     * Determines if the element is a valid element to stop the delegation loop and
     * emit the coordinates dataset.
     */
    isClickTarget(element) {
        return element.hasAttribute('ceddl-click') ||
            (element.nodeType === 1 && element.tagName.toUpperCase() === 'BUTTON') ||
            (element.nodeType === 1 && element.tagName.toUpperCase() === 'A');
    }

    /**
     * A deligation loop to find the clicked element and execute click callback
     * with that element.
     */
    delegate(callback, el) {
        let currentElement = el;

        do {
            if (!this.isClickTarget(currentElement)) continue;
            callback(currentElement);
            return;
        } while (currentElement.nodeName.toUpperCase() !== 'BODY' && (currentElement = currentElement.parentNode));
    }


    setListeners() {
        document.addEventListener('mousemove', (ev) => {
            if (this.DetectMouseUser(ev)) {
                if (this.idleTimeout) clearTimeout(this.idleTimeout);
                if (this.idleInterval) clearInterval(this.idleInterval);
                if (this.trackData) {
                    this.lastX = ev.pageX;
                    this.lastY = ev.pageY;
                    this.coordinates.push({
                        t: 1,
                        x: this.lastX,
                        y: this.lastY
                    });
                    this.trackData = false;
                }
                this.idleTimeout = setTimeout(this.startIdle, 500);
            }
        });

        /**
         * Be sure to collect data if when the user closes the tab
         * or exits the browser window. Also prevent idle user
         * collection in this scenario.
         */
        document.body.addEventListener('mouseleave', () => {
            if (this.idleInterval) {
                clearTimeout(this.idleTimeout);
                clearInterval(this.idleInterval);
                this.emitHeatmapCoordinates();
            }
        });

        /**
         * Store the mousedown position in the coordinates array.
         * If Clicked on a button or a link emit data.
         */
        document.body.addEventListener('mousedown',  (ev) => {
            this.coordinates.push({
                t: 2,
                x: ev.pageX,
                y: ev.pageY
            });
            this.delegate(this.emitHeatmapCoordinates, ev.target);
        });


        /**
         * Emit data on end of resize event because the width
         * of the frame changed and the layout probably different.
         */
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.emitHeatmapCoordinates();
            }, 300);
        });
    }
}

// When ceddl is on the global we auto initialize.
if(typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
    Heatmap.run(window['ceddl']);
}
