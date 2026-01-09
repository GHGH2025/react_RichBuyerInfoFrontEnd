// App.tsx (UPDATED) — removed the inner "Choose Specific Type" dropdown for ALL property sections
import React, { useMemo, useState } from 'react';
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
  ALL_PRICE_RANGES_OPTION,
  BEDS_OPTIONS,
  BATHS_OPTIONS,
} from './constants';

const INITIAL_PROPERTY_STATE: PropertyTypeState = {
  enabled: false,
  type: '',
  priceRanges: [],
  beds: [],
  baths: [],
  location: { scope: '', counties: [] },
  preferences: {},
  otherType: '',
};

const hasBedsBaths = (key: keyof AppState['properties']) =>
  key === 'singleFamily' || key === 'townhouse' || key === 'condo';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const [formData, setFormData] = useState<AppState>({
    contact: { name: '', email: '', callWhatsapp: '', communicationPreference: '' },
    properties: {
      multiFamily: { ...INITIAL_PROPERTY_STATE },
      condo: { ...INITIAL_PROPERTY_STATE },
      land: { ...INITIAL_PROPERTY_STATE },
      commercial: { ...INITIAL_PROPERTY_STATE },
      singleFamily: { ...INITIAL_PROPERTY_STATE },
      townhouse: { ...INITIAL_PROPERTY_STATE },
    },
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const updateContact = (field: keyof ContactInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  // ✅ Property selection is ONLY the checkbox toggle now.
  // We still set `type` automatically to the property title (for payload consistency),
  // but the user does NOT pick any sub-type anymore.
  const toggleProperty = (key: keyof AppState['properties']) => {
    setFormData(prev => {
      const currentlyEnabled = prev.properties[key].enabled;
      const config = PROPERTY_CONFIG[key];

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: currentlyEnabled
            ? { ...INITIAL_PROPERTY_STATE } // reset when turning off
            : {
                ...INITIAL_PROPERTY_STATE,
                enabled: true,
                type: config?.title || String(key), // auto-assign (no UI dropdown)
              },
        },
      };
    });
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

  const updatePropertyLocationScope = (key: keyof AppState['properties'], scope: '' | LocationScope) => {
    setFormData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: {
          ...prev.properties[key],
          location: {
            scope,
            counties: [], // reset counties when switching scope
          },
        },
      },
    }));
  };

  const togglePropertyCounty = (key: keyof AppState['properties'], county: string) => {
    setFormData(prev => {
      const current = prev.properties[key].location.counties || [];
      const next = current.includes(county)
        ? current.filter(x => x !== county)
        : [...current, county];

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: {
            ...prev.properties[key],
            location: {
              ...prev.properties[key].location,
              counties: next,
            },
          },
        },
      };
    });
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

  const isFormValid = useMemo(() => {
    const { contact, properties } = formData;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

    const isContactValid =
      contact.name.trim() !== '' &&
      isEmailValid &&
      contact.callWhatsapp.trim() !== '' &&
      contact.communicationPreference !== '';

    const enabledKeys = (Object.keys(properties) as Array<keyof typeof properties>).filter(
      k => properties[k].enabled
    );

    if (enabledKeys.length === 0) return false;

    const areEnabledPropertiesValid = enabledKeys.every(key => {
      const p = properties[key];

      // ✅ Location REQUIRED for each enabled property type
      if (!p.location?.scope) return false;
      if (p.location.scope === 'south_florida' && (p.location.counties?.length || 0) === 0)
        return false;

      // ✅ Beds/Baths REQUIRED only for Single Family / Townhouse / Condo
      if (hasBedsBaths(key)) {
        if (!p.beds || p.beds.length === 0) return false;
        if (!p.baths || p.baths.length === 0) return false;
      }

      return true;
    });

    return isContactValid && areEnabledPropertiesValid;
  }, [formData]);

  const formStatusSummary = useMemo(() => {
    const { contact, properties } = formData;
    const steps: string[] = [];

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

    if (!contact.name || !contact.email || !contact.callWhatsapp || !contact.communicationPreference) {
      steps.push('Fill in your Contact Info');
    } else if (!isEmailValid) {
      steps.push('Enter a valid Email address');
    }

    const enabledKeys = (Object.keys(properties) as Array<keyof typeof properties>).filter(
      k => properties[k].enabled
    );

    if (enabledKeys.length === 0) {
      steps.push("Select at least one Property Type (click 'Yes, send me...')");
    } else {
      enabledKeys.forEach(key => {
        const p = properties[key];
        const config = PROPERTY_CONFIG[key];

        if (!p.location?.scope) steps.push(`Select Location for ${config.title}`);
        if (p.location?.scope === 'south_florida' && (p.location.counties?.length || 0) === 0)
          steps.push(`Select at least 1 South Florida County for ${config.title}`);

        if (hasBedsBaths(key)) {
          if (!p.beds || p.beds.length === 0) steps.push(`Select Beds for ${config.title}`);
          if (!p.baths || p.baths.length === 0) steps.push(`Select Baths for ${config.title}`);
        }
      });
    }

    return steps;
  }, [formData]);

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

      console.log('Submitting API Payload:', JSON.stringify(formData, null, 2));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      setIsSubmitting(false); // allow retry if NOT submitted
      return;
    }

    // If submitted successfully, keep disabled
    setIsSubmitting(true);
  };

  if (isSubmitted) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
        } flex items-center justify-center p-6`}
      >
        <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl p-12 text-center border-2 border-slate-100 dark:border-slate-700">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
            <ShieldCheck className="text-white w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight uppercase">Confirmed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-bold">
            Your investment preferences have been synced with our system. A representative from So.
            Florida Home Buyers LLC will contact you soon.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            Send new preferences
          </button>
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
          Brought to you by FloridaRealEstate.Chat
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
                    {[
                      'Choose a Property Type',
                      'Choose Your Special Preferences',
                      'Repeat for Each Property Type',
                    ].map((text, i) => (
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
                    ))}
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
                      under Special Preference, the AI will {' '}
                      <span className="italic underline">ONLY</span> send you properties that match that specific preference. The AI will NOT stack {' '}
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

                {/* Communication Preference */}
                <div className="space-y-3">
                  <label
                    className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone size={12} className="text-blue-600" /> Choose your communication
                    preferences*
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.contact.communicationPreference}
                      onChange={e =>
                        updateContact(
                          'communicationPreference',
                          e.target.value as CommunicationPreference
                        )
                      }
                      className={`w-full px-6 md:px-8 py-5 md:py-6 rounded-2xl border-2 appearance-none transition-all outline-none focus:ring-4 ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                          : 'bg-white border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200'
                      }`}
                    >
                      <option value="">-- Select Preference --</option>
                      <option value="Text">Text</option>
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Call">Call</option>
                    </select>
                    <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                      <ArrowRight size={20} />
                    </div>
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
                {(Object.keys(PROPERTY_CONFIG) as Array<keyof typeof PROPERTY_CONFIG>).map(
                  key => {
                    const config = PROPERTY_CONFIG[key];
                    const state = formData.properties[key];
                    const isCommercial = key === 'commercial';

                    const prices =
                      key === 'condo' || key === 'townhouse'
                        ? PRICE_RANGES_CONDO_TH
                        : PRICE_RANGES_DEFAULT;

                    const Icon = {
                      multiFamily: Layout,
                      condo: Waves,
                      land: Trees,
                      commercial: Store,
                      singleFamily: Home,
                      townhouse: Building2,
                    }[key];

                    const locationRequiredButMissing =
                      state.enabled &&
                      (!state.location?.scope ||
                        (state.location.scope === 'south_florida' &&
                          state.location.counties.length === 0));

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
                              {/* ✅ Price (multi-select) for non-commercial — no dependency on any sub-type */}
                              {!isCommercial && (
                                <div className="space-y-4">
                                  <label
                                    className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 ${
                                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    }`}
                                  >
                                    <ArrowRight size={14} className="text-blue-600" /> How Much Will
                                    You Pay?
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
                                          ${
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

                                  <p
                                    className={`text-[10px] font-bold italic ${
                                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                    }`}
                                  >
                                    Selecting “All price ranges” will automatically deselect other
                                    ranges.
                                  </p>
                                </div>
                              )}

                              {/* Location (REQUIRED) */}
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
                                      {LOCATION_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                                      <ArrowRight size={20} />
                                    </div>
                                  </div>
                                </div>

                                {state.location.scope === 'south_florida' && (
                                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <label
                                      className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                      }`}
                                    >
                                      Counties (South Florida)*{' '}
                                      <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
                                    </label>

                                    <div
                                      className={`grid grid-cols-2 sm:grid-cols-3 gap-1 p-2 rounded-2xl border transition-all ${
                                        isDarkMode
                                          ? 'bg-slate-800 border-slate-700 shadow-inner'
                                          : 'bg-white border-slate-200 shadow-sm'
                                      }`}
                                    >
                                      {SOUTH_FLORIDA_COUNTIES.map(c => (
                                        <label key={c} className="relative w-full">
                                          <input
                                            type="checkbox"
                                            checked={state.location.counties.includes(c)}
                                            onChange={() => togglePropertyCounty(key, c)}
                                            className="sr-only peer"
                                          />
                                          <div
                                            className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-center
                                            peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-2xl
                                            ${
                                              isDarkMode
                                                ? 'text-slate-500 hover:text-slate-200'
                                                : 'text-slate-400 hover:text-slate-900'
                                            }`}
                                          >
                                            {c}
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                )}
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
                                        Beds*{' '}
                                        <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
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
                                              ${
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

                                    <div className="space-y-4">
                                      <label
                                        className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                        }`}
                                      >
                                        Baths*{' '}
                                        <span className="ml-2 text-[9px] opacity-70">(multi-select)</span>
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
                                              ${
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
                              {(locationRequiredButMissing || bedsBathsMissing) && (
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
                                      {locationRequiredButMissing && (
                                        <li>• Select location + counties (if South Florida)</li>
                                      )}
                                      {bedsBathsMissing && <li>• Select Beds and Baths</li>}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
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

        <footer
          className={`py-24 mt-24 border-t ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-500'
              : 'bg-white border-slate-100 text-slate-400'
          }`}
        >
          <div className="max-w-6xl mx-auto px-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-10">
              <Building2 size={32} className="text-blue-600" />
              <span
                className={`text-2xl md:text-3xl font-black tracking-tighter uppercase ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                SO. FLORIDA HOME BUYERS LLC
              </span>
            </div>
            <p className="text-sm max-w-2xl mx-auto leading-relaxed font-bold tracking-tight px-4 mb-16">
              Connecting premium capital with high-potential real estate opportunities across South
              Florida through precise local expertise and strategic matching.
            </p>
            <div className="flex items-center justify-center gap-10">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600">
                SO. FLORIDA HOME BUYERS LLC 2025
              </p>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
