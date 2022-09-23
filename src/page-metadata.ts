export class PageMetadata {
    private static instance: PageMetadata;
    private ceddl: any;

    /**
     * The static method to initialize the plugin.
     */
    public static run(ceddl): PageMetadata {
        if (!PageMetadata.instance) {
            PageMetadata.instance = new PageMetadata(ceddl);
        }

        return PageMetadata.instance;
    }

    constructor(ceddl) {
        this.ceddl = ceddl;
        this.createPageMetadataModel();
        this.pageReady(() => {
            this.ceddl.emitModel('pageMetadata', this.getPageMeta());
            this.setListeners();
        });  
    }

    pageReady(callback) {

        /**
         * Prevent errors in server side prerendering applications. 
         */
        if(typeof document === 'undefined') {
            return;
        }

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
     * detects if the browser has Cookies enabled.
     * @return {Boolean} ret
     */
    hasCookies() {
        if (navigator.cookieEnabled) {
            return true;
        }

        document.cookie = "cookietest=1";
        const ret = document.cookie.indexOf("cookietest=") != -1;
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        return ret;
    }

    setListeners() {
        window.addEventListener('hashchange', () =>{
            this.ceddl.emitModel('pageMetadata', this.getPageMeta());
        });
        this.ceddl.eventbus.on('initialize', () => {
            this.ceddl.emitModel('pageMetadata', this.getPageMeta());
        });
    }

    createPageMetadataModel() {
        this.ceddl.modelFactory.create({
            key: 'pageMetadata',
            fields: {
                url: {
                    type: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                },
                path: {
                    type: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                },
                referrer: {
                    type: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                },
                title: {
                    type: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                },
                url_section: {
                    type: this.ceddl.modelFactory.fields.ArrayField,
                    fieldType: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                },
                cookie: {
                    type:this.ceddl.modelFactory.fields.BooleanField,
                    required: false,
                },
                touch: {
                    type: this.ceddl.modelFactory.fields.BooleanField,
                    required: false,
                },
                device_pixel_ratio: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: false,
                },
                resolution: {
                    type: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                },
                width: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: false,
                },
                height: {
                    type: this.ceddl.modelFactory.fields.NumberField,
                    required: false,
                },
                query_string: {
                    type: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                },
                hash: {
                    type: this.ceddl.modelFactory.fields.StringField,
                    required: false,
                }
            }
        });
    }

    /**
     * Detects some basic parameters from the browser.
     * @return {object} features
     */
    private features: any;
    detectFeatures() {
        if(this.features) {
            return this.features;
        }

        const devicePixelRatio = window.devicePixelRatio || 1;
        const cookie = this.hasCookies();
        // @ts-ignore
        const touch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
        // @ts-ignore
        const width = Math.round(parseInt(screen.width, 10) * devicePixelRatio);
        // @ts-ignore
        const height = Math.round(parseInt(screen.height, 10) * devicePixelRatio);
        const resolution = width + 'x' + height;

        this.features = {
            cookie: cookie,
            touch: touch,
            device_pixel_ratio: (Math.round(devicePixelRatio * 1000) / 1000).toFixed(3),
            resolution: resolution,
            width: width,
            height: height,
        };

        return this.features;
    }

    /**
     * getPageState is a helper function to collect all the browser and custom element data
     * converting it into the page data object.
     */
    getPageMeta() {
        const data = this.detectFeatures();

        data.title = document.title;
        data.url = window.location.href;
        data.path = document.location.pathname;
        data.referrer = document.referrer;
        data.url_section = window.location.pathname.split('/').filter(function(part){
            return part.length !== 0;
        }).map(function(part){
            return part.replace(/\.[^/.]+$/, "");
        });
        data.hash = window.location.hash;
        data.query_string = window.location.search;

        return data;
    }

}

// When ceddl is on the global we auto initialize.
if(typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
    PageMetadata.run(window['ceddl']);
}
