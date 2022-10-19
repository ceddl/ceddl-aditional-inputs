/**
 * No official standard for this tracking method. Is widely used and therefor
 * proposed as a plugin for ceddl. see UTM Builders guides.
 * https://search.brave.com/search?q=utm+builders&source=web
 */

export interface UrchinOptions {
  prefix?:string;
  removeOnLoad?:boolean
}

export class UrchinTracking {
  private static instance: UrchinTracking;
  private ceddl: any;

  /**
   * The static method to initialize the plugin.
   */
  public static run(ceddl, options: UrchinOptions | undefined): UrchinTracking {
    if (!UrchinTracking.instance) {
      UrchinTracking.instance = new UrchinTracking(ceddl, options);
    }

    return UrchinTracking.instance;
  }

  constructor(ceddl, options: UrchinOptions | undefined) {
    this.ceddl = ceddl;
    this.createUrchinModel();

    // No ie11 support.
    if (URLSearchParams) {
      const urchinArray = this.getUrchinData(options);
      // Move from array to object based model without assigning variables.
      if(urchinArray.length > 0) {
        this.removeUrchinFromUrl(urchinArray, options);
        ceddl.emitModel('urchinTracking', {...urchinArray.reduce((accumulator, value) => {
            return {...accumulator, [value[0]]: value[1]};
          }, {}), ...{}});
      }
    }
  }

  /**
   *   Urchin Tracking Module (UTM) parameters from the url
   *   and removing the prefixes from the modelkeys
   */
  getUrchinData(options) {
    const prefix = !options || !options.prefix ? 'utm' : options.prefix;
    const searchParams = new URLSearchParams(window.location.search);
    return Array.from(searchParams).filter(function (utms) {
      return utms[0].startsWith(`${prefix}_`);
    }).map((utms) => {
      return [utms[0].replace(new RegExp(prefix+'_', 'i'), ''), utms[1]]
    });
  }

  removeUrchinFromUrl(urchinArray, options) {
    const prefix = !options || !options.prefix ? 'utm' : options.prefix;
    const removeOnLoad = !options || options.prefix === true ? true : false;
    const parsedUrl = new URL(window.location.href);
    const urlParams = parsedUrl.searchParams;

    if (!urlParams) {
      return window.location.href;
    }

    if(removeOnLoad) {
      urchinArray.forEach((value) => {
        urlParams.delete(`${prefix}_${value[0]}`);
      })
    }

    const previousState = history.state;
    history.replaceState(previousState, '', parsedUrl.toString());

  }

  createUrchinModel() {
    this.ceddl.modelFactory.create({
      key: 'urchinTracking',
      fields: {
        source: {
          type: this.ceddl.modelFactory.fields.StringField,
          required: true,
        },
        medium: {
          type: this.ceddl.modelFactory.fields.StringField,
          required: true,
        },
        campaign: {
          type: this.ceddl.modelFactory.fields.StringField,
          required: false,
        },
        content: {
          type: this.ceddl.modelFactory.fields.StringField,
          required: false,
        },
        term: {
          type: this.ceddl.modelFactory.fields.StringField,
          required: false,
        }
      }
    });
  }
}
// When ceddl is on the global we auto initialize.
if(typeof window !== 'undefined' && typeof window['ceddl'] !== 'undefined') {
  UrchinTracking.run(window['ceddl'], window['urchinOptions']);
}