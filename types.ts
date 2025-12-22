
export type PreferenceValue = 'No' | 'Yes' | 'Maybe' | 'Only';

export interface PropertyPreferences {
  [key: string]: PreferenceValue;
}

export interface PropertyTypeState {
  enabled: boolean;
  type: string;
  priceRange: string;
  preferences: PropertyPreferences;
  otherType?: string; // Field for custom commercial type input
}

export interface ContactInfo {
  name: string;
  company: string;
  email: string;
  textNumber: string; // The "Text" field from instructions
  phoneCall: string;  // The "Phone Call" field from instructions
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
  location: {
    county: string;
    city: string;
  };
}
