import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Moon, ShieldCheck, Sun } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-md ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft size={14} />
            Back to Form
          </Link>

          <button
            type="button"
            onClick={() => setIsDarkMode(v => !v)}
            className={`p-3 rounded-2xl border-2 transition-all ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-amber-300'
                : 'bg-white border-slate-100 text-slate-600'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div
          className={`rounded-[2.5rem] border-2 p-8 md:p-14 shadow-xl ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p
                className={`text-[10px] font-black uppercase tracking-[0.25em] ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                WholesaleDealFinder.ai
              </p>
              <h1
                className={`text-3xl md:text-4xl font-black tracking-tight uppercase ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Privacy Policy
              </h1>
            </div>
          </div>

          <p
            className={`text-sm font-bold mb-10 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Last Updated: February 2026
          </p>

          <div
            className={`space-y-8 text-sm md:text-base leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                1. Introduction
              </h2>
              <p>
                WholesaleDealFinder.ai (“we,” “us,” or “our”) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, protect, and handle your personal
                information when you use our website, services, email communications, and text
                messaging programs. This policy is governed by and intended to comply with the laws
                of the State of Florida.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                2. Information We Collect
              </h2>
              <p className="font-bold">a. Information You Provide</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Account and Buy Box preferences</li>
                <li>Communication preferences</li>
              </ul>
              <p className="font-bold pt-2">b. Automatically Collected Information</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address</li>
                <li>Browser and device information</li>
                <li>Website usage and interaction data</li>
              </ul>
              <p className="font-bold pt-2">c. Authorized Third-Party Data</p>
              <p>
                Information from emails, chats, websites, or other sources you explicitly authorize us
                to process.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                3. How We Use Your Information
              </h2>
              <p>
                We use your information to provide and operate WholesaleDealFinder.ai, filter and
                deliver deal notifications, communicate service updates and promotions, improve
                functionality, and comply with legal requirements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                4. No Sale or Sharing of Personal Information
              </h2>
              <p>
                We do not sell, rent, trade, lease, or share your personal information with third
                parties for marketing or data monetization.
              </p>
              <p>
                SMS opt-in or phone numbers for the purpose of SMS are not being shared with any
                third party or affiliate company for marketing purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                5. Email Communications
              </h2>
              <p>
                By creating an account, you consent to receive account-related and promotional
                emails. You may unsubscribe from non-essential emails at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                6. Text Messaging (SMS) – TCPA &amp; Carrier Compliance
              </h2>
              <p>
                By opting in, you consent to receive SMS or MMS messages. Message frequency varies.
                Message and data rates may apply. Reply STOP to opt out or text/call{' '}
                <a href="tel:7542001204" className="underline font-bold text-blue-600">
                  754-200-1204
                </a>{' '}
                for HELP/assistance. All messaging complies with the Telephone Consumer Protection
                Act (TCPA).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                7. Communication Preferences
              </h2>
              <p>
                You may update your email and SMS preferences at any time through your account
                settings or by contacting us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                8. Data Security
              </h2>
              <p>
                We implement reasonable safeguards to protect your personal information, though no
                system is 100% secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                9. Data Retention
              </h2>
              <p>
                We retain personal information only as long as necessary to provide services and
                comply with legal obligations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                10. Third-Party Service Providers
              </h2>
              <p>
                Trusted third-party vendors may be used and are contractually required to safeguard
                your data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                11. Children’s Privacy
              </h2>
              <p>WholesaleDealFinder.ai is not intended for individuals under 18 years of age.</p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                12. Your Rights (Florida Residents)
              </h2>
              <p>
                You may request access, correction, or deletion of your personal information, subject
                to legal requirements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                13. Changes to This Policy
              </h2>
              <p>
                We may update this policy from time to time. Continued use constitutes acceptance of
                changes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                14. Contact Information
              </h2>
              <div
                className={`p-6 rounded-2xl border-2 space-y-2 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <p className="font-black uppercase tracking-tight">WholesaleDealFinder.ai</p>
                <p>1314 East Las Olas Boulevard #642</p>
                <p>Fort Lauderdale, FL 33301</p>
                <p>
                  Phone:{' '}
                  <a href="tel:7542001204" className="underline font-bold text-blue-600">
                    754-200-1204
                  </a>
                  {' | '}
                  <a href="tel:9544150122" className="underline font-bold text-blue-600">
                    954-415-0122
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:iamthemanagerllc@gmail.com"
                    className="underline font-bold text-blue-600"
                  >
                    iamthemanagerllc@gmail.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer
        className={`py-10 border-t ${
          isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-3">
          <Building2 size={18} className="text-blue-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
            WholesaleDealFinder.ai
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
