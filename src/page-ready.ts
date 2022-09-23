export class PageReady {
    private static instance: PageReady;
    private ceddl: any;
    private _store = {};
    private _listeners = [];
    private _el : any;
    private pageReadyWarning: any;

    /**
     * The static method to initialize the plugin.
     */
    public static run(ceddl): PageReady {
        if (!PageReady.instance) {
            PageReady.instance = new PageReady(ceddl);
        }

        return PageReady.instance;
    }

    constructor(ceddl) {
        this.ceddl = ceddl;
        this.setCompleteListener = this.setCompleteListener.bind(this);
        this.isStoreValid= this.isStoreValid.bind(this);
        this._el = document.querySelector('[data-page-ready]');
        this.pageReadySetListeners(this._el ? this._el.getAttribute('data-page-ready') : '');
        this.ceddl.eventbus.on('initialize', () => {
            this._el = document.querySelector('[data-page-ready]');
            this.pageReadySetListeners(this._el ? this._el.getAttribute('data-page-ready') : '');
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
     * Reducer function to check if all keys in the store are set to true.
     * @param {Boolean} acc
     * @param {String} key
     * @returns
     */
    isStoreValid(acc, key) {
        return acc && this._store[key];
    }

    /**
     * Helper function that creates event callbacks which set the event as
     * completed on execution, as well as checking whether all keys in the
     * store are true, and dispatch the pageready event should that be the
     * case.
     * @param {String} name Event name to mark as completed on execution.
     * @returns {Function}
     */
    createCompleteCallback(name) {
        return (data) => {
            this._store[name] = data;

            const allCallbacksComplete = Object.keys(this._store).reduce(this.isStoreValid, true);
            if (allCallbacksComplete) {
                clearTimeout(this.pageReadyWarning);
                this.ceddl.emitEvent('pageready', this._store);
            }
        };
    }

    setCompleteListener(name) {
        // Keep a reference to the callback so we can remove it from the eventbus.
        const markComplete = this.createCompleteCallback(name);
        this.ceddl.eventbus.once(name, markComplete);

        return {
            name: name,
            markComplete: markComplete
        };
    }

    startWarningTimeout() {
        if(typeof this.pageReadyWarning !== "undefined") {
            clearTimeout(this.pageReadyWarning);
        }
        this.pageReadyWarning = setTimeout(() =>{
            this.ceddl.emitEvent('pageready', {
                error: true,
                msg: 'Failed to complete within 4000 ms'
            });
        }, 4000);
    }


    /**
     * Method to indicate when to fire the pageready event. It takes a collection
     * of event names and waits until all of them have fired at least once before
     * dispatching the pageready event.
     */
    pageReadySetListeners(eventNames) {
        // Reset the previous state
        this._store = {};
        this._listeners.forEach((eventCallback) => {
            this.ceddl.eventbus.off(eventCallback.name, eventCallback.markComplete);
        });
        this._listeners = [];

        // If there is no need to wait for anything dispatch event when the page is ready.
        if (!eventNames || eventNames.length === 0) {
            this.pageReady(() => {
                this.ceddl.emitEvent('pageready', this._store);
            });
            return;
        }

        this.startWarningTimeout();

        if (!Array.isArray(eventNames)) {
            // Split on whitespace and remove empty entries.
            eventNames = eventNames.split(' ').filter((value) => {
                return !!value;
            });
        }

        if(this._el) {
            this._el.setAttribute('data-page-ready', eventNames.join(' '));
        }

        // Create the new state
        eventNames.forEach((name) => {
            this._store[name] = false;
        });
        this._listeners = eventNames.map(this.setCompleteListener);
    }
}

// When ceddl is on the global we auto initialize.
if(typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
    PageReady.run(window['ceddl']);
}
