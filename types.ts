
// export type PreferenceValue = 'No' | 'Yes' | 'Maybe' | 'Only';

// export interface PropertyPreferences {
//   [key: string]: PreferenceValue;
// }

// export interface PropertyTypeState {
//   enabled: boolean;
//   type: string;
//   priceRange: string;
//   preferences: PropertyPreferences;
//   otherType?: string; // Field for custom commercial type input
// }

// export interface ContactInfo {
//   name: string;
//   company: string;
//   email: string;
//   textNumber: string; // The "Text" field from instructions
//   phoneCall: string;  // The "Phone Call" field from instructions
// }

// export interface AppState {
//   contact: ContactInfo;
//   properties: {
//     multiFamily: PropertyTypeState;
//     condo: PropertyTypeState;
//     land: PropertyTypeState;
//     commercial: PropertyTypeState;
//     singleFamily: PropertyTypeState;
//     townhouse: PropertyTypeState;
//   };
//   location: {
//     county: string;
//     city: string;
//   };
// }


// export type PreferenceValue = 'No' | 'Yes' | 'Maybe' | 'Only';

// export type CommunicationPreference = 'Text' | 'Email' | 'WhatsApp' | 'Call';

// export type LocationScope = 'all_florida' | 'south_florida';

// export interface PropertyPreferences {
//   [key: string]: PreferenceValue;
// }

// export interface PropertyLocation {
//   scope: '' | LocationScope;
//   counties: string[]; // only used when scope === 'south_florida'
// }

// export interface PropertyTypeState {
//   enabled: boolean;

//   // Keep this for compatibility (commercial + any property config with multiple "options")
//   type: string;

//   // UPDATED: multi-select
//   priceRanges: string[];

//   // NEW: required for Single Family / Townhouse / Condo
//   beds: string[];
//   baths: string[];

//   // NEW: location rules per property type
//   location: PropertyLocation;

//   preferences: PropertyPreferences;
//   otherType?: string;
// }

// export interface ContactInfo {
//   name: string;
//   email: string;
//   callWhatsapp: string; // digits only
//   communicationPreference: '' | CommunicationPreference;
// }

// export interface AppState {
//   contact: ContactInfo;
//   properties: {
//     multiFamily: PropertyTypeState;
//     condo: PropertyTypeState;
//     land: PropertyTypeState;
//     commercial: PropertyTypeState;
//     singleFamily: PropertyTypeState;
//     townhouse: PropertyTypeState;
//   };
// }



// types.ts
// types.ts

export type PreferenceValue = 'No' | 'Yes' | 'Maybe' | 'Only';

export type LocationScope = 'all_florida' | 'south_florida';

export type CommunicationPreference = 'Text' | 'Email' | 'WhatsApp' | 'Call';

export interface ContactInfo {
  name: string;
  email: string;
  callWhatsapp: string;

  // multi-select
  communicationPreference: CommunicationPreference[];
}

export interface PropertyTypeState {
  enabled: boolean;

  /**
   * ✅ MULTI-SELECT: "Choose Specific Type"
   * Required for: multiFamily / condo / land / commercial
   */
  type: string[];

  priceRanges: string[];
  beds: string[];
  baths: string[];

  location: { scope: '' | LocationScope };

  preferences: Record<string, PreferenceValue>;

  // Commercial "Other" textbox (required only when "Other" is selected)
  otherType: string;
}

export interface GlobalLocationState {
  counties: string[];
  cities: string[];
}

export interface AppState {
  contact: ContactInfo;

  properties: {
    multiFamily: PropertyTypeState;
    condo: PropertyTypeState;
    land: PropertyTypeState;
    commercial: PropertyTypeState;
    singleFamily: PropertyTypeState;
    townhouse: PropertyTypeState;
  };

  location: GlobalLocationState;
}
