/**
 * No official standard for this tracking method. Is widely used and therefor
 * proposed as a plugin for ceddl. see UTM Builders guides.
 * https://search.brave.com/search?q=utm+builders&source=web
 */
export class UrchinTracking {
  private static instance: UrchinTracking;
  private ceddl: any;

  /**
   * The static method to initialize the plugin.
   */
  public static run(ceddl, prefix: string | undefined): UrchinTracking {
    if (!UrchinTracking.instance) {
      UrchinTracking.instance = new UrchinTracking(ceddl, prefix);
    }

    return UrchinTracking.instance;
  }

  constructor(ceddl, prefix: string | undefined) {
    this.ceddl = ceddl;
    this.createUrchinModel();

    // No ie11 support.
    if (URLSearchParams) {
      const urchinArray = this.getUrchinData(prefix);
      // Move from array to object based model without assigning variables.
      if(urchinArray.length > 0) {
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
  getUrchinData(prefix = 'utm') {
    const searchParams = new URLSearchParams(window.location.search);
    return Array.from(searchParams).filter(function (utms) {
      return utms[0].startsWith(`${prefix}_`);
    }).map((utms) => {
      return [utms[0].replace(new RegExp(prefix+'_', 'i'), ''), utms[1]]
    });
  }

  createUrchinModel() {
    this.ceddl.modelFactory.create({
      key: 'urchinTracking',
      fields: {
        id: {
          type: this.ceddl.modelFactory.fields.StringField,
          required: false,
        },
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
  UrchinTracking.run(window['ceddl'], window['urchinTrackingPrefix']);
}