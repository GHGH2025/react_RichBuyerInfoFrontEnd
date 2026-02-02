// App.tsx (UPDATED) — restored inner "Choose Specific Type" dropdown for Multi/Condo/Land/Commercial
import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Sun,
  Moon,
  Home,
  Waves,
  Layout,
  Store,
  Trees,
  PhoneCall,
  Mail,
  Smartphone,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import {
  AppState,
  PropertyTypeState,
  ContactInfo,
  PreferenceValue,
  LocationScope,
  CommunicationPreference,
} from './types';
import {
  PROPERTY_CONFIG,
  PRICE_RANGES_DEFAULT,
  PRICE_RANGES_CONDO_TH,
  SOUTH_FLORIDA_COUNTIES,
  LOCATION_OPTIONS,
  PROPERTY_LOCATION_OPTIONS,
  ALL_PRICE_RANGES_OPTION,
  BEDS_OPTIONS,
  BATHS_OPTIONS,
  COUNTIES,
  CITIES_BY_COUNTY,
} from './constants';

const ALL_CITIES_OPTION = 'All Cities';

const INITIAL_PROPERTY_STATE: PropertyTypeState = {
  enabled: false,
  type: [], // ✅ now array
  priceRanges: [],
  beds: [],
  baths: [],
  // location: { scope: '' },
  location: { scope: '', counties: [], cities: [] },
  preferences: {},
  otherType: '',
};


const hasBedsBaths = (key: keyof AppState['properties']) =>
  key === 'singleFamily' || key === 'townhouse' || key === 'condo';

const requiresSubtype = (key: keyof AppState['properties']) =>
  key === 'multiFamily' || key === 'land' || key === 'commercial';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [citySearch, setCitySearch] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<AppState>({
    contact: { name: '', email: '', callWhatsapp: '', communicationPreference: [] },
    properties: {
      multiFamily: { ...INITIAL_PROPERTY_STATE },
      condo: { ...INITIAL_PROPERTY_STATE },
      land: { ...INITIAL_PROPERTY_STATE },
      commercial: { ...INITIAL_PROPERTY_STATE },
      singleFamily: { ...INITIAL_PROPERTY_STATE },
      townhouse: { ...INITIAL_PROPERTY_STATE },
    },
    // location: {
    //   counties: [],
    //   cities: [],
    // },
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const updateContact = (field: keyof Omit<ContactInfo, 'communicationPreference'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const toggleCommunicationPreference = (value: CommunicationPreference) => {
    setFormData(prev => {
      const curr = prev.contact.communicationPreference || [];
      const next = curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value];
      return {
        ...prev,
        contact: {
          ...prev.contact,
          communicationPreference: next,
        },
      };
    });
  };

  const toggleProperty = (key: keyof AppState['properties']) => {
  setFormData(prev => {
    const currentlyEnabled = prev.properties[key].enabled;
    const config = PROPERTY_CONFIG[key];

    if (currentlyEnabled) {
      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: { ...INITIAL_PROPERTY_STATE },
        },
      };
    }

    // ✅ On enable:
    // - For singleFamily/townhouse (only 1 option), auto-set type as ARRAY
    // - For multi/condo/land/commercial, user must choose type(s) (required)
    const autoType =
      !requiresSubtype(key) && config?.options?.length === 1 ? [config.options[0]] : [];

    return {
      ...prev,
      properties: {
        ...prev.properties,
        [key]: {
          ...INITIAL_PROPERTY_STATE,
          enabled: true,
          type: autoType,
        },
      },
    };
  });
};


 const togglePropertySubtype = (key: keyof AppState['properties'], value: string) => {
  setFormData(prev => {
    const curr = prev.properties[key].type || [];
    const next = curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value];

    return {
      ...prev,
      properties: {
        ...prev.properties,
        [key]: {
          ...prev.properties[key],
          type: next,
          // ✅ If commercial and "Other" is NOT selected anymore, clear otherType
          otherType: key === 'commercial' && !next.includes('Other') ? '' : prev.properties[key].otherType,
        },
      },
    };
  });
};


  const updateCommercialOtherType = (value: string) => {
    setFormData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        commercial: {
          ...prev.properties.commercial,
          otherType: value,
        },
      },
    }));
  };

  const updatePreference = (
    key: keyof AppState['properties'],
    prefKey: string,
    value: PreferenceValue
  ) => {
    setFormData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: {
          ...prev.properties[key],
          preferences: {
            ...prev.properties[key].preferences,
            [prefKey]: value,
          },
        },
      },
    }));
  };

  // const updatePropertyLocationScope = (key: keyof AppState['properties'], scope: '' | LocationScope) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     properties: {
  //       ...prev.properties,
  //       [key]: {
  //         ...prev.properties[key],
  //         location: { scope },
  //       },
  //     },
  //   }));
  // };

  const updatePropertyLocationScope = (key: keyof AppState['properties'], scope: '' | LocationScope) => {
    setFormData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: {
          ...prev.properties[key],
          location: {
            scope,
            // ✅ reset selection when scope changes to avoid mixed state
            counties: [],
            cities: [],
          },
        },
      },
    }));

    // ✅ clear search UI when switching away
    setCitySearch(prev => ({ ...prev, [key]: '' }));
  };


  const toggleExclusiveMultiSelect = (
    current: string[],
    value: string,
    exclusiveValue: string
  ): string[] => {
    if (value === exclusiveValue) return [exclusiveValue];
    const withoutExclusive = current.filter(v => v !== exclusiveValue);
    return withoutExclusive.includes(value)
      ? withoutExclusive.filter(v => v !== value)
      : [...withoutExclusive, value];
  };

  const togglePriceRange = (key: keyof AppState['properties'], value: string) => {
    setFormData(prev => {
      const curr = prev.properties[key].priceRanges || [];
      const next = toggleExclusiveMultiSelect(curr, value, ALL_PRICE_RANGES_OPTION);

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: { ...prev.properties[key], priceRanges: next },
        },
      };
    });
  };

  const toggleBeds = (key: keyof AppState['properties'], value: string) => {
    setFormData(prev => {
      const curr = prev.properties[key].beds || [];
      const next = toggleExclusiveMultiSelect(curr, value, 'Any');

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: { ...prev.properties[key], beds: next },
        },
      };
    });
  };

  const toggleBaths = (key: keyof AppState['properties'], value: string) => {
    setFormData(prev => {
      const curr = prev.properties[key].baths || [];
      const next = toggleExclusiveMultiSelect(curr, value, 'Any');

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: { ...prev.properties[key], baths: next },
        },
      };
    });
  };

  const togglePropertyCounty = (key: keyof AppState['properties'], county: string) => {
    setFormData(prev => {
      const curr = prev.properties[key].location.counties || [];
      const next = curr.includes(county) ? curr.filter(c => c !== county) : [...curr, county];

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: {
            ...prev.properties[key],
            location: {
              ...prev.properties[key].location,
              counties: next,
              cities: [], // ✅ counties mode: no cities
            },
          },
        },
      };
    });
  };

  const togglePropertyCity = (key: keyof AppState['properties'], city: string) => {
    setFormData(prev => {
      const curr = prev.properties[key].location.cities || [];
      const next = curr.includes(city) ? curr.filter(c => c !== city) : [...curr, city];

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: {
            ...prev.properties[key],
            location: {
              ...prev.properties[key].location,
              cities: next,
              counties: [], // ✅ cities mode: no counties
            },
          },
        },
      };
    });
  };


  // ---------- ✅ Enabled keys ----------
  const enabledKeys = useMemo(() => {
    const props = formData.properties;
    return (Object.keys(props) as Array<keyof typeof props>).filter(k => props[k].enabled);
  }, [formData.properties]);

  // const allPropertyLocationScopesChosen = useMemo(() => {
  //   if (enabledKeys.length === 0) return false;
  //   return enabledKeys.every(k => !!formData.properties[k].location?.scope);
  // }, [enabledKeys, formData.properties]);

  // // ---------- ✅ Derived final location scope (global) ----------
  // const derivedLocationScope = useMemo<'' | LocationScope>(() => {
  //   if (enabledKeys.length === 0) return '';
  //   if (!allPropertyLocationScopesChosen) return '';

  //   const anyAllFlorida = enabledKeys.some(
  //     k => formData.properties[k].location.scope === 'all_florida'
  //   );
  //   return anyAllFlorida ? 'all_florida' : 'south_florida';
  // }, [enabledKeys, allPropertyLocationScopesChosen, formData.properties]);

  // const allowedCounties = useMemo<string[]>(() => {
  //   if (!derivedLocationScope) return [];
  //   return derivedLocationScope === 'all_florida' ? COUNTIES : SOUTH_FLORIDA_COUNTIES;
  // }, [derivedLocationScope]);

  // const availableCities = useMemo<string[]>(() => {
  //   const selectedCounties = formData.location.counties || [];
  //   if (selectedCounties.length === 0) return [];

  //   const set = new Set<string>();
  //   for (const county of selectedCounties) {
  //     const list = CITIES_BY_COUNTY[county] || CITIES_BY_COUNTY['default'] || [];
  //     for (const city of list) set.add(city);
  //   }

  //   const cities = Array.from(set);
  //   // ensure All Cities is available
  //   if (!cities.includes(ALL_CITIES_OPTION)) cities.unshift(ALL_CITIES_OPTION);
  //   return cities;
  // }, [formData.location.counties]);

  // ---------- ✅ Global county/city selection handlers ----------
  // const toggleGlobalCounty = (county: string) => {
  //   setFormData(prev => {
  //     const curr = prev.location.counties || [];
  //     const nextCounties = curr.includes(county) ? curr.filter(c => c !== county) : [...curr, county];

  //     // sanitize cities based on nextCounties
  //     if (nextCounties.length === 0) {
  //       return { ...prev, location: { counties: [], cities: [] } };
  //     }

  //     const citySet = new Set<string>();
  //     for (const c of nextCounties) {
  //       const list = CITIES_BY_COUNTY[c] || CITIES_BY_COUNTY['default'] || [];
  //       for (const city of list) citySet.add(city);
  //     }

  //     const currCities = prev.location.cities || [];
  //     const keepAllCities = currCities.includes(ALL_CITIES_OPTION);

  //     const nextCities = keepAllCities
  //       ? [ALL_CITIES_OPTION]
  //       : currCities.filter(city => citySet.has(city));

  //     return {
  //       ...prev,
  //       location: {
  //         counties: nextCounties,
  //         cities: nextCities,
  //       },
  //     };
  //   });
  // };

  // const toggleGlobalCity = (city: string) => {
  //   setFormData(prev => {
  //     const curr = prev.location.cities || [];
  //     const next = toggleExclusiveMultiSelect(curr, city, ALL_CITIES_OPTION);

  //     return {
  //       ...prev,
  //       location: {
  //         ...prev.location,
  //         cities: next,
  //       },
  //     };
  //   });
  // };

  // // ✅ When derived scope changes, drop invalid counties/cities automatically
  // useEffect(() => {
  //   if (!derivedLocationScope) return;

  //   setFormData(prev => {
  //     const nextCounties = (prev.location.counties || []).filter(c => allowedCounties.includes(c));

  //     // rebuild allowed city set from nextCounties
  //     const citySet = new Set<string>();
  //     for (const c of nextCounties) {
  //       const list = CITIES_BY_COUNTY[c] || CITIES_BY_COUNTY['default'] || [];
  //       for (const city of list) citySet.add(city);
  //     }

  //     let nextCities = prev.location.cities || [];

  //     // if no counties, must clear cities
  //     if (nextCounties.length === 0) nextCities = [];

  //     // keep All Cities if selected + counties exist
  //     if (nextCities.includes(ALL_CITIES_OPTION)) {
  //       nextCities = nextCounties.length > 0 ? [ALL_CITIES_OPTION] : [];
  //     } else {
  //       nextCities = nextCities.filter(city => citySet.has(city));
  //     }

  //     // no changes
  //     const sameCounties =
  //       nextCounties.length === (prev.location.counties || []).length &&
  //       nextCounties.every((c, i) => c === (prev.location.counties || [])[i]);

  //     const sameCities =
  //       nextCities.length === (prev.location.cities || []).length &&
  //       nextCities.every((c, i) => c === (prev.location.cities || [])[i]);

  //     if (sameCounties && sameCities) return prev;

  //     return {
  //       ...prev,
  //       location: {
  //         counties: nextCounties,
  //         cities: nextCities,
  //       },
  //     };
  //   });
  // }, [derivedLocationScope, allowedCounties]);

  // ---------- ✅ Validation ----------
  const isFormValid = useMemo(() => {
    const { contact, properties, location } = formData;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

    const isContactValid =
      contact.name.trim() !== '' &&
      isEmailValid &&
      contact.callWhatsapp.trim() !== '' &&
      Array.isArray(contact.communicationPreference) &&
      contact.communicationPreference.length > 0;

    if (enabledKeys.length === 0) return false;

    // each enabled property: required fields
    const areEnabledPropertiesValid = enabledKeys.every(key => {
      const p = properties[key];

      // a) property-level location option required (All Florida/South Florida)
      if (!p.location?.scope) return false;

      if (p.location.scope === 'counties' && (!p.location.counties || p.location.counties.length === 0))
        return false;

      if (p.location.scope === 'cities' && (!p.location.cities || p.location.cities.length === 0))
        return false;


      // b) subtype required for multi/condo/land/commercial
      if (requiresSubtype(key)) {
  if (!Array.isArray(p.type) || p.type.length === 0) return false;

  // ✅ "Other" required only if selected
  if (
    key === 'commercial' &&
    p.type.includes('Other') &&
    (!p.otherType || p.otherType.trim() === '')
  )
    return false;
}

      // c) price required for ALL enabled property types
      if (!p.priceRanges || p.priceRanges.length === 0) return false;

      // d) beds/baths required for those that have them
      if (hasBedsBaths(key)) {
        if (!p.beds || p.beds.length === 0) return false;
        if (!p.baths || p.baths.length === 0) return false;
      }

      return true;
    });

    // // global derived scope must exist (only when all property scopes picked)
    // if (!derivedLocationScope) return false;

    // // global counties + cities required
    // const isGlobalLocationValid =
    //   Array.isArray(location.counties) &&
    //   location.counties.length > 0 &&
    //   Array.isArray(location.cities) &&
    //   location.cities.length > 0;

    // return isContactValid && areEnabledPropertiesValid && isGlobalLocationValid;

    return isContactValid && areEnabledPropertiesValid;

  }, [formData, enabledKeys]);

  const formStatusSummary = useMemo(() => {
    const { contact, properties, location } = formData;
    const steps: string[] = [];

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

    if (!contact.name || !contact.email || !contact.callWhatsapp) {
      steps.push('Fill in your Contact Info');
    } else if (!isEmailValid) {
      steps.push('Enter a valid Email address');
    } else if (!contact.communicationPreference || contact.communicationPreference.length === 0) {
      steps.push('Select at least 1 Communication Preference');
    }

    if (enabledKeys.length === 0) {
      steps.push("Select at least one Property Type (click 'Yes, send me...')");
    } else {
      enabledKeys.forEach(key => {
        const p = properties[key];
        const config = PROPERTY_CONFIG[key];

        if (!p.location?.scope) steps.push(`Select Location Option for ${config.title}`);

        if (p.location?.scope === 'counties' && (!p.location.counties || p.location.counties.length === 0))
          steps.push(`Select at least 1 County for ${config.title}`);

        if (p.location?.scope === 'cities' && (!p.location.cities || p.location.cities.length === 0))
          steps.push(`Select at least 1 City for ${config.title}`);


        if (requiresSubtype(key) && (!Array.isArray(p.type) || p.type.length === 0))
  steps.push(`Select Property Type for ${config.title}`);

        if (
  key === 'commercial' &&
  Array.isArray(p.type) &&
  p.type.includes('Other') &&
  (!p.otherType || p.otherType.trim() === '')
)
  steps.push(`Enter Other Commercial Type`);

        if (!p.priceRanges || p.priceRanges.length === 0) steps.push(`Select Price Range for ${config.title}`);

        if (hasBedsBaths(key)) {
          if (!p.beds || p.beds.length === 0) steps.push(`Select Beds for ${config.title}`);
          if (!p.baths || p.baths.length === 0) steps.push(`Select Baths for ${config.title}`);
        }
      });
    }

    // if (!derivedLocationScope) {
    //   steps.push('Select All Florida/South Florida in each selected Property Type');
    // } else {
    //   if (!location.counties || location.counties.length === 0) steps.push('Select at least 1 County');
    //   if (!location.cities || location.cities.length === 0) steps.push('Select at least 1 City');
    // }
    

    return steps;
  }, [formData, enabledKeys]);

  const API_BASE_URL =
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (process as any).env?.REACT_APP_API_BASE_URL ||
    '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    if (isSubmitting) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/api/buyer-submissions`;

      // ✅ Final payload includes derived global location scope
      const payload = {
        ...formData,
        // location: {
        //   scope: derivedLocationScope,
        //   counties: formData.location.counties,
        //   cities: formData.location.cities,
        // },
      };

      console.log('Submitting API Payload:', JSON.stringify(payload, null, 2));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errText = `Request failed (${res.status})`;
        try {
          const errJson = await res.json();
          errText = errJson?.detail || errJson?.error || JSON.stringify(errJson);
        } catch {
          errText = await res.text();
        }
        throw new Error(errText);
      }

      await res.json();

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
  };

  // if (isSubmitted) {
  //   return (
  //     <div
  //       className={`min-h-screen ${
  //         isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
  //       } flex items-center justify-center p-6`}
  //     >
  //       <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl p-12 text-center border-2 border-slate-100 dark:border-slate-700">
  //         <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
  //           <ShieldCheck className="text-white w-12 h-12" />
  //         </div>
  //         <h2 className="text-4xl font-black mb-4 tracking-tight uppercase">Confirmed</h2>
  //         <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-bold">
  //           Your investment preferences have been synced with our system. A representative from So.
  //           Florida Home Buyers LLC will contact you soon.
  //         </p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
  //         >
  //           Send new preferences
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  if (isSubmitted) {
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
      } flex items-center justify-center p-6`}
    >
      <div className="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl p-10 md:p-14 text-center border-2 border-slate-100 dark:border-slate-700">
        {/* Icon */}
        {/* <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
          <ShieldCheck className="text-white w-12 h-12" />
        </div> */}

        {/* Headline */}
        <div className="mb-10 space-y-2">
          <p className="text-sm md:text-base font-extrabold tracking-widest uppercase text-slate-600 dark:text-slate-200">
            Welcome to
          </p>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-slate-900 dark:text-white drop-shadow-sm">
            WholesaleDealFinder.Ai
          </h2>
        </div>


        <p className="text-lg md:text-xl font-extrabold mb-10 text-slate-600 dark:text-slate-300">
          It&apos;s Time to Reclaim Your Time!
        </p>

        {/* Body */}
        <div className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300 leading-relaxed space-y-6">
          <p className="text-xl font-black text-slate-900 dark:text-white">
            Let Our Ai Do <span className="uppercase">ALL</span> the work for you.
          </p>

          <p className="font-bold">
            Stop Scrolling, Stop Scanning — &amp; Start Receiving.
          </p>

          <div className="pt-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              What to Expect Next?
            </h3>

            <div className="space-y-5 text-left md:text-center">
              <div>
                <p className="font-black text-slate-900 dark:text-white">
                  — Look Out for an Email &amp; Text from us —
                </p>
                <p className="mt-2">
                  This is where you will get a chance to customize your Ai further.
                  <br />
                  This is not a necessary step, but a special Ai feature we offer you.
                  <br />
                  This is where you can fully replace your job of looking for deals — and let the Ai do the work for you!
                </p>
              </div>

              <div>
                <p className="font-black text-slate-900 dark:text-white">
                  — Look Out for Deals —
                </p>
                <p className="mt-2">
                  24/7 Our Ai will be on the hunt looking for deals for you,
                  sending them only to your preferred communication preferences.
                </p>
              </div>

              <div>
                <p className="font-black text-slate-900 dark:text-white">
                  — Updating Your Buy Box —
                </p>
                <p className="mt-2">
                  If you ever need to update your Buy Box, visit our website.
                  <br />
                  Go to the dropdown menu. Choose — <span className="font-black">Update My Buy Box</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-xl font-black text-slate-900 dark:text-white">
              The Future of Finding Wholesale Deals Begins Now!
            </p>
            <p className="text-2xl font-black mt-3 text-slate-900 dark:text-white">
              Welcome!
            </p>

            <div className="mt-6 font-bold">
              <p>Richard Burdette, Founder</p>
              <p className="font-black uppercase">WholesaleDealFinder.Ai</p>
            </div>
          </div>
        </div>

        {/* Optional footer note (small) */}
        <p className="mt-10 text-xs font-semibold text-slate-400 dark:text-slate-500">
          You may now close this page.
        </p>
      </div>
    </div>
  );
}

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div
        className={`min-h-screen ${
          isDarkMode ? 'bg-slate-900' : 'bg-[#FBFBFF]'
        } transition-colors duration-500 pb-20`}
      >
        {/* High-End Navigation */}
        <nav
          className={`sticky top-0 z-50 w-full px-8 py-6 border-b ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-100'
          } backdrop-blur-xl`}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-4 ring-blue-600/10">
                <Building2 className="text-white w-6 h-6" />
              </div>

              <div>
                <h1
                  className={`text-xl md:text-2xl font-black tracking-tighter leading-none ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  WholesaleDealFinder.Ai
                </h1>

                <p
                  className={`text-[10px] uppercase font-black tracking-[0.35em] mt-1 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  Brought to you by{' '}
                  <span>
                    <span className="text-orange-500">F</span>lorida
                    <span className="text-orange-500">R</span>eal
                    <span className="text-orange-500">E</span>state.Chat
                  </span>
                </p>

                <p
                  className={`text-[10px] uppercase font-black tracking-[0.35em] mt-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Property Preference Portal
                </p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl border-2 transition-all ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-800 text-slate-200'
                  : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 shadow-sm'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 py-16">
          <form onSubmit={handleSubmit} className="space-y-20">
            {/* ✅ Disclaimer / Beta Access Box */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div
                className={`rounded-[3rem] p-10 md:p-12 shadow-2xl ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'
                } border-2 relative overflow-hidden`}
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-purple-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-purple-600/20">
                      <Info className="w-7 h-7" />
                    </div>

                    <div>
                      <h2
                        className={`text-3xl font-black tracking-tight uppercase ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Free Beta - Limited Early Access
                      </h2>

                      <p
                        className={`text-sm font-bold ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        } uppercase tracking-widest`}
                      >
                        Disclaimer
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-3xl border-2 flex gap-5 items-start ${
                      isDarkMode
                        ? 'bg-purple-900/10 border-purple-800/30'
                        : 'bg-purple-50/50 border-purple-100'
                    }`}
                  >
                    <AlertCircle className="text-purple-500 w-6 h-6 shrink-0 mt-0.5" />

                    <p
                      className={`text-sm leading-relaxed min-w-0 break-words ${
                        isDarkMode ? 'text-purple-200' : 'text-purple-900/80'
                      }`}
                    >
                      <span className="font-black uppercase tracking-wider mr-2 underline break-all">
                        WHOLESALEDEALFINDER.AI:
                      </span>{' '}
                      is currently in free beta. We’re working closely with early users to refine the
                      platform and dial in results.
                      <br />
                      <br />
                      The first <span className="font-black">300 users</span> get full access at no
                      cost during beta.
                      <br />
                      <br />
                      Pricing will be introduced later, and early users will receive{' '}
                      <span className="font-black">preferred, grandfathered pricing</span> when paid
                      plans launch.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 1: Directions */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div
                className={`rounded-[3rem] p-10 md:p-12 shadow-2xl ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'
                } border-2 relative overflow-hidden`}
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                      <Info className="w-7 h-7" />
                    </div>
                    <div>
                      <h2
                        className={`text-3xl font-black tracking-tight uppercase ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Special Notes & Direction
                      </h2>
                      <p
                        className={`text-sm font-bold ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        } uppercase tracking-widest`}
                      >
                        Guidance for submitting your preferences
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Choose a Property Type', 'Choose Your Special Preferences', 'Repeat for Each Property Type'].map(
                      (text, i) => (
                        <div
                          key={i}
                          className={`p-6 rounded-[2rem] border-2 transition-all ${
                            isDarkMode
                              ? 'bg-slate-900/50 border-slate-700'
                              : 'bg-blue-50/30 border-blue-50'
                          } flex gap-4 items-center`}
                        >
                          <span className="text-3xl font-black text-blue-600/20">{i + 1}</span>
                          <p
                            className={`text-sm font-bold leading-tight ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-700'
                            }`}
                          >
                            {text}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <div
                    className={`p-6 rounded-3xl border-2 flex gap-5 items-start ${
                      isDarkMode
                        ? 'bg-amber-900/10 border-amber-800/30'
                        : 'bg-amber-50/50 border-amber-100'
                    }`}
                  >
                    <AlertCircle className="text-amber-500 w-6 h-6 shrink-0 mt-0.5" />
                    <p
                      className={`text-sm leading-relaxed ${
                        isDarkMode ? 'text-amber-200' : 'text-amber-900/80'
                      }`}
                    >
                      <span className="font-black uppercase tracking-wider mr-2 underline">
                        Important Note:
                      </span>{' '}
                      If you select{' '}
                      <span className="font-black text-blue-600 dark:text-blue-400">"ONLY"</span>{' '}
                      under Special Preference, the AI will <span className="italic underline">ONLY</span>{' '}
                      send you properties that match that specific preference. The AI will NOT stack{' '}
                      <span className="italic underline">ONLY</span> requests.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Contact Information */}
            <section className="space-y-10">
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                  <User size={20} />
                </div>
                <h3
                  className={`text-2xl font-black tracking-tight uppercase ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Contact Profile
                </h3>
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-10 md:p-14 rounded-[3.5rem] shadow-xl ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                } border-2`}
              >
                {/* Name */}
                <div className="space-y-3">
                  <label
                    className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <User size={12} className="text-blue-600" /> Name*
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.contact.name}
                    onChange={e => updateContact('name', e.target.value)}
                    placeholder="e.g. John Wick"
                    className={`w-full px-6 py-5 rounded-2xl border-2 transition-all outline-none focus:ring-4 ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label
                    className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <Mail size={12} className="text-blue-600" /> Email*
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.contact.email}
                    onChange={e => updateContact('email', e.target.value)}
                    placeholder="investor@example.com"
                    className={`w-full px-6 py-5 rounded-2xl border-2 transition-all outline-none focus:ring-4 ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Call/WhatsApp */}
                <div className="space-y-3">
                  <label
                    className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <PhoneCall size={12} className="text-blue-600" /> Call / WhatsApp*
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.contact.callWhatsapp}
                    onChange={e => updateContact('callWhatsapp', e.target.value.replace(/\D/g, ''))}
                    placeholder="Digits only (e.g. 3055550123)"
                    className={`w-full px-6 py-5 rounded-2xl border-2 transition-all outline-none focus:ring-4 ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Communication Preference (MULTI-SELECT) */}
                <div className="space-y-3">
                  <label
                    className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone size={12} className="text-blue-600" /> Choose your communication
                    preferences* <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
                  </label>

                  <div
                    className={`grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 rounded-2xl border transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 shadow-inner'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    {(['Text', 'Email', 'WhatsApp', 'Call'] as CommunicationPreference[]).map(val => (
                      <label key={val} className="relative w-full">
                        <input
                          type="checkbox"
                          checked={formData.contact.communicationPreference.includes(val)}
                          onChange={() => toggleCommunicationPreference(val)}
                          className="sr-only peer"
                        />
                        <div
                          className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
                          peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
                          ${isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                          {val}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Property Types */}
            <section className="space-y-12">
              <div className="text-center space-y-4">
                <h3
                  className={`text-4xl font-black tracking-tighter uppercase ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  What kind of property would you buy?
                </h3>
                <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-600/20"></div>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {(Object.keys(PROPERTY_CONFIG) as Array<keyof typeof PROPERTY_CONFIG>).map(key => {
                  const config = PROPERTY_CONFIG[key];
                  const state = formData.properties[key];
                  const isCommercial = key === 'commercial';

                  const prices =
                    key === 'condo' || key === 'townhouse' ? PRICE_RANGES_CONDO_TH : PRICE_RANGES_DEFAULT;

                  const Icon = {
                    multiFamily: Layout,
                    condo: Waves,
                    land: Trees,
                    commercial: Store,
                    singleFamily: Home,
                    townhouse: Building2,
                  }[key];

                  const locationScopeMissing = state.enabled && !state.location?.scope;

                  const subtypeMissing =
  state.enabled && requiresSubtype(key) && (!Array.isArray(state.type) || state.type.length === 0);

const commercialOtherMissing =
  state.enabled &&
  key === 'commercial' &&
  Array.isArray(state.type) &&
  state.type.includes('Other') &&
  (!state.otherType || state.otherType.trim() === '');


                  const priceMissing = state.enabled && (!state.priceRanges || state.priceRanges.length === 0);

                  const bedsBathsMissing =
                    state.enabled &&
                    hasBedsBaths(key) &&
                    ((state.beds?.length || 0) === 0 || (state.baths?.length || 0) === 0);

                  return (
                    <div
                      key={key}
                      className={`rounded-[3.5rem] border-2 transition-all duration-700 ${
                        state.enabled
                          ? isDarkMode
                            ? 'bg-slate-800 border-blue-500 shadow-2xl shadow-blue-500/10'
                            : 'bg-white border-blue-600 ring-[12px] ring-blue-600/5 shadow-2xl'
                          : isDarkMode
                          ? 'bg-slate-800/40 border-slate-700 opacity-60'
                          : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="p-8 md:p-14">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                          <div className="flex items-center gap-6">
                            <div
                              className={`p-5 rounded-[1.5rem] transition-all duration-700 ${
                                state.enabled
                                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40 scale-110'
                                  : isDarkMode
                                  ? 'bg-slate-700 text-slate-500'
                                  : 'bg-blue-50/50 text-blue-600'
                              }`}
                            >
                              <Icon size={32} />
                            </div>
                            <div>
                              <h4
                                className={`text-2xl md:text-3xl font-black tracking-tight uppercase ${
                                  isDarkMode ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {config.title}
                              </h4>
                              <p
                                className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                Preference Settings
                              </p>
                            </div>
                          </div>

                          {/* Property toggle */}
                          <label
                            className={`flex items-center gap-6 cursor-pointer select-none px-6 md:px-8 py-5 md:py-6 rounded-[2rem] border-2 transition-all group ${
                              state.enabled
                                ? 'bg-blue-600 border-blue-700 text-white'
                                : isDarkMode
                                ? 'bg-slate-900/50 border-slate-700 text-slate-500'
                                : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-blue-100'
                            }`}
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={state.enabled}
                                onChange={() => toggleProperty(key)}
                                className="sr-only peer"
                              />
                              <div
                                className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-all duration-300 ${
                                  state.enabled ? 'bg-blue-400' : 'bg-slate-300 dark:bg-slate-700'
                                } peer-focus:outline-none relative flex items-center px-[2px] after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:after:translate-x-6 md:peer-checked:after:translate-x-7`}
                              ></div>
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">
                              Yes, send me this type of property.
                            </span>
                          </label>
                        </div>

                        {state.enabled && (
                          <div className="animate-in fade-in zoom-in-95 duration-700 space-y-16">
                            {/* ✅ Re-added: Choose Specific Type dropdown */}
                            {/* ✅ Choose Specific Type (MULTI-SELECT) */}
{requiresSubtype(key) && (
  <div className="space-y-4">
    <label
      className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 ${
        isDarkMode ? 'text-slate-400' : 'text-slate-500'
      }`}
    >
      <ArrowRight size={14} className="text-blue-600" /> Choose Specific Type*
      <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
    </label>

    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-1 p-2 rounded-2xl border transition-all ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700 shadow-inner'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {config.options.map(opt => (
        <label key={opt} className="relative w-full">
          <input
            type="checkbox"
            checked={(state.type || []).includes(opt)}
            onChange={() => togglePropertySubtype(key, opt)}
            className="sr-only peer"
          />
          <div
            className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
            peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
            ${isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {opt}
          </div>
        </label>
      ))}
    </div>

    {/* ✅ Commercial "Other" textbox (required if "Other" selected) */}
    {key === 'commercial' && (state.type || []).includes('Other') && (
      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
        <label
          className={`text-[10px] font-black uppercase tracking-[0.3em] ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Please specify other commercial type*
        </label>
        <input
          required
          type="text"
          value={state.otherType}
          onChange={e => updateCommercialOtherType(e.target.value)}
          placeholder="Enter type..."
          className={`w-full px-6 py-5 rounded-2xl border-2 transition-all outline-none focus:ring-4 ${
            isDarkMode
              ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
              : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200 focus:bg-white'
          }`}
        />
      </div>
    )}
  </div>
)}


                            {/* ✅ Price REQUIRED (ALL property types) */}
                            <div className="space-y-4">
                              <label
                                className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                <ArrowRight size={14} className="text-blue-600" /> How Much Will You Pay?*
                                <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
                              </label>

                              <div
                                className={`grid grid-cols-1 sm:grid-cols-2 gap-1 p-2 rounded-2xl border transition-all ${
                                  isDarkMode
                                    ? 'bg-slate-800 border-slate-700 shadow-inner'
                                    : 'bg-white border-slate-200 shadow-sm'
                                }`}
                              >
                                {prices.map(val => (
                                  <label key={val} className="relative w-full">
                                    <input
                                      type="checkbox"
                                      checked={state.priceRanges.includes(val)}
                                      onChange={() => togglePriceRange(key, val)}
                                      className="sr-only peer"
                                    />
                                    <div
                                      className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
                                      peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
                                      ${isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                                    >
                                      {val}
                                    </div>
                                  </label>
                                ))}
                              </div>

                              <p
                                className={`text-[10px] font-bold italic ${
                                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                Selecting “All price ranges” will automatically deselect other ranges.
                              </p>
                            </div>

                            {/* Beds/Baths REQUIRED for Single Family / Townhouse / Condo */}
                            {hasBedsBaths(key) && (
                              <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                  <div className="space-y-4">
                                    <label
                                      className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                      }`}
                                    >
                                      Beds* <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
                                    </label>

                                    <div
                                      className={`grid grid-cols-2 sm:grid-cols-3 gap-1 p-2 rounded-2xl border transition-all ${
                                        isDarkMode
                                          ? 'bg-slate-800 border-slate-700 shadow-inner'
                                          : 'bg-white border-slate-200 shadow-sm'
                                      }`}
                                    >
                                      {BEDS_OPTIONS.map(val => (
                                        <label key={val} className="relative w-full">
                                          <input
                                            type="checkbox"
                                            checked={state.beds.includes(val)}
                                            onChange={() => toggleBeds(key, val)}
                                            className="sr-only peer"
                                          />
                                          <div
                                            className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
                                            peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
                                            ${isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                                          >
                                            {val}
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <label
                                      className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                      }`}
                                    >
                                      Baths* <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
                                    </label>

                                    <div
                                      className={`grid grid-cols-2 sm:grid-cols-3 gap-1 p-2 rounded-2xl border transition-all ${
                                        isDarkMode
                                          ? 'bg-slate-800 border-slate-700 shadow-inner'
                                          : 'bg-white border-slate-200 shadow-sm'
                                      }`}
                                    >
                                      {BATHS_OPTIONS.map(val => (
                                        <label key={val} className="relative w-full">
                                          <input
                                            type="checkbox"
                                            checked={state.baths.includes(val)}
                                            onChange={() => toggleBaths(key, val)}
                                            className="sr-only peer"
                                          />
                                          <div
                                            className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
                                            peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
                                            ${isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                                          >
                                            {val}
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <p
                                  className={`text-[10px] font-bold italic ${
                                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                  }`}
                                >
                                  Selecting “Any” will automatically deselect other options.
                                </p>
                              </div>
                            )}

                            {/* Location (property-level) REQUIRED */}
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <label
                                  className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                  }`}
                                >
                                  <MapPin size={14} className="text-blue-600" /> Location*
                                </label>

                                <div className="relative">
                                  <select
                                    required
                                    value={state.location.scope}
                                    onChange={e =>
                                      updatePropertyLocationScope(
                                        key,
                                        e.target.value as '' | LocationScope
                                      )
                                    }
                                    className={`w-full px-6 md:px-8 py-5 md:py-6 rounded-2xl border-2 appearance-none transition-all outline-none focus:ring-4 ${
                                      isDarkMode
                                        ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                                        : 'bg-white border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200'
                                    }`}
                                  >
                                    <option value="">-- Select Location --</option>
                                    {PROPERTY_LOCATION_OPTIONS.map(opt => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>

                                  {/* ✅ Counties selection (per property) */}
                                  {state.location.scope === 'counties' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                      <label
                                        className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                        }`}
                                      >
                                        Counties* <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
                                      </label>

                                      <div
                                        className={`p-2 rounded-2xl border transition-all ${
                                          isDarkMode
                                            ? 'bg-slate-800 border-slate-700 shadow-inner'
                                            : 'bg-white border-slate-200 shadow-sm'
                                        } max-h-80 overflow-y-auto`}
                                      >
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                          {COUNTIES.map(c => (
                                            <label key={c} className="relative w-full">
                                              <input
                                                type="checkbox"
                                                checked={(state.location.counties || []).includes(c)}
                                                onChange={() => togglePropertyCounty(key, c)}
                                                className="sr-only peer"
                                              />
                                              <div
                                                className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
                                                peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
                                                ${isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                                              >
                                                {c}
                                              </div>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* ✅ Cities selection (per property) */}
                                  {state.location.scope === 'cities' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                      <label
                                        className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                        }`}
                                      >
                                        Cities* <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
                                      </label>

                                      {/* Search */}
                                      <input
                                        type="text"
                                        value={citySearch[key] || ''}
                                        onChange={e => setCitySearch(prev => ({ ...prev, [key]: e.target.value }))}
                                        placeholder="Search city..."
                                        className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none focus:ring-4 ${
                                          isDarkMode
                                            ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                                            : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200 focus:bg-white'
                                        }`}
                                      />

                                      {/* Selected summary */}
                                      <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-[11px] font-bold`}>
                                        {(state.location.cities || []).length} cities selected
                                        {(state.location.cities || []).length > 0 ? (
                                          <span className="font-black">
                                            {`, i.e. ${(state.location.cities || []).slice(0, 12).join(', ')}${
                                              (state.location.cities || []).length > 12 ? '…' : ''
                                            }`}
                                          </span>
                                        ) : null}
                                      </p>

                                      {/* Dropdown list grouped by county */}
                                      <div
                                        className={`p-2 rounded-2xl border transition-all ${
                                          isDarkMode
                                            ? 'bg-slate-800 border-slate-700 shadow-inner'
                                            : 'bg-white border-slate-200 shadow-sm'
                                        } max-h-96 overflow-y-auto`}
                                      >
                                        {(() => {
                                          const q = (citySearch[key] || '').trim().toLowerCase();
                                          const entries = Object.entries(CITIES_BY_COUNTY).filter(([county]) => county !== 'default');

                                          // Build grouped filtered list
                                          const groups = entries
                                            .map(([county, cities]) => {
                                              const filtered = (cities || []).filter(city => {
                                                if (!city || city === 'All Cities') return false;
                                                if (!q) return true;
                                                return city.toLowerCase().includes(q);
                                              });
                                              return { county, cities: filtered };
                                            })
                                            .filter(g => g.cities.length > 0);

                                          if (groups.length === 0) {
                                            return (
                                              <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-[11px] font-bold p-4`}>
                                                No matching cities found.
                                              </p>
                                            );
                                          }

                                          return (
                                            <div className="space-y-4">
                                              {groups.map(g => (
                                                <div key={g.county} className="space-y-2">
                                                  <div
                                                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                      isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-slate-50 text-slate-700'
                                                    }`}
                                                  >
                                                    {g.county} County
                                                  </div>

                                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                                    {g.cities.map(city => (
                                                      <label key={`${g.county}-${city}`} className="relative w-full">
                                                        <input
                                                          type="checkbox"
                                                          checked={(state.location.cities || []).includes(city)}
                                                          onChange={() => togglePropertyCity(key, city)}
                                                          className="sr-only peer"
                                                        />
                                                        <div
                                                          className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
                                                          peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
                                                          ${isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                                                        >
                                                          {city}
                                                        </div>
                                                      </label>
                                                    ))}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  )}

                                  <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                                    <ArrowRight size={20} />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Special Preferences Matrix (non-commercial only) */}
                            {!isCommercial && (
                              <div className="space-y-10 transition-all duration-700">
                                <div className="flex items-center gap-5">
                                  <h5
                                    className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                                      isDarkMode ? 'text-blue-400' : 'text-blue-800'
                                    }`}
                                  >
                                    Special Preferences Matrix
                                  </h5>
                                  <div className="h-0.5 flex-1 bg-blue-600/10"></div>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                  {config.prefs.map(pref => (
                                    <div
                                      key={pref}
                                      className={`group p-6 md:p-8 rounded-[2.5rem] flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all border-2 ${
                                        isDarkMode
                                          ? 'bg-slate-900/40 border-slate-700'
                                          : 'bg-[#FAFBFF] border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl'
                                      }`}
                                    >
                                      <span
                                        className={`text-sm font-bold leading-relaxed max-w-xl ${
                                          isDarkMode ? 'text-slate-200' : 'text-slate-900'
                                        }`}
                                      >
                                        {pref}
                                      </span>
                                      <div
                                        className={`grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 md:p-2 rounded-2xl border transition-all ${
                                          isDarkMode
                                            ? 'bg-slate-800 border-slate-700 shadow-inner'
                                            : 'bg-white border-slate-200 shadow-sm'
                                        }`}
                                      >
                                        {['No', 'Yes', 'Maybe', 'Only'].map(val => (
                                          <label key={val} className="relative w-full">
                                            <input
                                              type="radio"
                                              name={`${key}-${pref}`}
                                              value={val}
                                              checked={state.preferences[pref] === val}
                                              onChange={() =>
                                                updatePreference(key, pref, val as PreferenceValue)
                                              }
                                              className="sr-only peer"
                                            />
                                            <div
                                              className={`px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl ${
                                                isDarkMode
                                                  ? 'text-slate-500 hover:text-slate-200'
                                                  : 'text-slate-400 hover:text-slate-900'
                                              }`}
                                            >
                                              {val}
                                            </div>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Visual warnings */}
                            {(locationScopeMissing ||
                              subtypeMissing ||
                              commercialOtherMissing ||
                              priceMissing ||
                              bedsBathsMissing) && (
                              <div
                                className={`p-6 rounded-3xl border-2 flex gap-5 items-start ${
                                  isDarkMode
                                    ? 'bg-amber-900/10 border-amber-800/30'
                                    : 'bg-amber-50/50 border-amber-100'
                                }`}
                              >
                                <AlertCircle className="text-amber-500 w-6 h-6 shrink-0 mt-0.5" />
                                <div
                                  className={`text-sm leading-relaxed ${
                                    isDarkMode ? 'text-amber-200' : 'text-amber-900/80'
                                  }`}
                                >
                                  <p className="font-black uppercase tracking-wider underline mb-2">
                                    Required for this section:
                                  </p>
                                  <ul className="text-[12px] font-bold space-y-1">
                                    {subtypeMissing && <li>• Select Property Type</li>}
                                    {commercialOtherMissing && <li>• Enter Other Commercial Type</li>}
                                    {priceMissing && <li>• Select Price Range</li>}
                                    {bedsBathsMissing && <li>• Select Beds and Baths</li>}
                                    {locationScopeMissing && <li>• Select Location (All Florida / South Florida)</li>}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>



            {/* Submission Area */}
            <section className="pt-16">
              <div
                className={`p-14 rounded-[4rem] text-center border-4 transition-all duration-700 ${
                  isFormValid
                    ? 'bg-blue-600/5 border-blue-600 shadow-[0_0_80px_rgba(37,99,235,0.15)]'
                    : 'bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800'
                }`}
              >
                <div className="max-w-2xl mx-auto space-y-10">
                  <button
                    disabled={!isFormValid || isSubmitting}
                    type="submit"
                    className={`group w-full py-8 px-12 rounded-[2rem] text-2xl font-black uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-6 active:scale-95 ${
                      isFormValid && !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/40'
                        : 'bg-white dark:bg-slate-900 text-blue-600/30 dark:text-slate-700 border-2 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-80'
                    }`}
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                    <ArrowRight
                      className={`w-8 h-8 transition-transform group-hover:translate-x-3 ${
                        !isFormValid || isSubmitting ? 'opacity-10' : ''
                      }`}
                    />
                  </button>

                  {submitError && (
                    <div className="px-8 py-5 rounded-[2rem] bg-rose-600/10 border border-rose-600/20">
                      <p
                        className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                          isDarkMode ? 'text-rose-300' : 'text-rose-700'
                        }`}
                      >
                        Submit failed
                      </p>
                      <p
                        className={`text-[11px] font-bold mt-2 ${
                          isDarkMode ? 'text-rose-200/80' : 'text-rose-700/80'
                        }`}
                      >
                        {submitError}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-5">
                    {!isFormValid ? (
                      <div className="flex flex-col items-center gap-3 px-8 py-5 rounded-[2rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                          <p
                            className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            Form status: INCOMPLETE
                          </p>
                        </div>
                        <p
                          className={`text-[10px] font-bold ${
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          } italic max-w-sm leading-relaxed`}
                        >
                          {formStatusSummary.length > 0
                            ? `To finish, please: ${formStatusSummary.join(' • ')}`
                            : 'Almost there! Checking details...'}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 px-8 py-5 rounded-[2rem] bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} />
                          <p className="text-[11px] font-black uppercase tracking-[0.2em]">
                            Status: READY TO SYNC
                          </p>
                        </div>
                        <p className="text-[10px] font-bold opacity-80 italic">
                          Everything looks perfect! You are now ready to submit your profile.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </form>
        </main>
      </div>
    </div>
  );
};

export default App;


        // <footer
        //   className={`py-24 mt-24 border-t ${
        //     isDarkMode
        //       ? 'bg-slate-900 border-slate-800 text-slate-500'
        //       : 'bg-white border-slate-100 text-slate-400'
        //   }`}
        // >
        //   <div className="max-w-6xl mx-auto px-8 text-center">
        //     <div className="flex items-center justify-center gap-4 mb-10">
        //       <Building2 size={32} className="text-blue-600" />
        //       <span
        //         className={`text-2xl md:text-3xl font-black tracking-tighter uppercase ${
        //           isDarkMode ? 'text-white' : 'text-slate-900'
        //         }`}
        //       >
        //         SO. FLORIDA HOME BUYERS LLC
        //       </span>
        //     </div>
        //     <p className="text-sm max-w-2xl mx-auto leading-relaxed font-bold tracking-tight px-4 mb-16">
        //       Connecting premium capital with high-potential real estate opportunities across South
        //       Florida through precise local expertise and strategic matching.
        //     </p>
        //     <div className="flex items-center justify-center gap-10">
        //       <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800"></div>
        //       <p className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600">
        //         SO. FLORIDA HOME BUYERS LLC 2025
        //       </p>
        //       <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800"></div>
        //     </div>
        //   </div>
        // </footer>