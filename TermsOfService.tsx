import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, FileText, Moon, Sun } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const headingClass = `text-lg font-black uppercase tracking-tight ${
    isDarkMode ? 'text-white' : 'text-slate-900'
  }`;

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
              <FileText size={22} />
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
                Terms of Use
              </h1>
            </div>
          </div>

          <p
            className={`text-sm font-bold mb-10 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Last Updated: February 3rd, 2026
          </p>

          <div
            className={`space-y-8 text-sm md:text-base leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <section className="space-y-3">
              <h2 className={headingClass}>1. Company Information</h2>
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
              <p>
                WholesaleDealFinder.ai is brought to you by FloridaRealEstate.Chat and is a
                subsidiary of the Chat.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>2. Description of Service</h2>
              <p>
                WholesaleDealFinder.ai provides an AI-powered filtering and notification service
                designed to analyze deal information received from third-party sources designated by
                the user, including but not limited to emails, chats, websites, and similar
                communications.
              </p>
              <p>
                The service processes, categorizes, and forwards deal information based on
                user-defined preferences (“Buy Box”) so users can more efficiently review
                opportunities.
              </p>
              <p>
                WholesaleDealFinder.ai does not scrape, harvest, or extract data from third-party
                systems without user authorization. The platform does not create listings, verify
                deal accuracy, guarantee availability, or determine deal quality. All information is
                provided for convenience only.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>3. No Brokerage Relationship</h2>
              <p>
                WholesaleDealFinder.ai is not a real estate brokerage, agent, or advisor and does not
                represent buyers or sellers. Use of this platform does not create any fiduciary,
                agency, or brokerage relationship.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>4. Affiliate Brokerage Disclosure</h2>
              <p>WholesaleDealFinder.ai is a technology and AI services company only.</p>
              <p>
                An affiliated entity, Wholesale Home Sales LLC, may, at the user’s request and under
                separate agreements, assist with real estate-related services independent of the AI
                platform, including but not limited to setting appointments, coordinating property
                access and photos, assisting with purchase contracts, and facilitating communications
                related to potential acquisitions.
              </p>
              <p>
                Any brokerage or transactional assistance is provided solely by Wholesale Home Sales
                LLC pursuant to its own licenses, disclosures, and agreements. Users are under no
                obligation to use any affiliated services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>5. Eligibility</h2>
              <p>
                By using this website or service, you represent and warrant that you are at least 18
                years old, have legal authority to enter into this agreement, and are not a
                Competitor as defined in Section 11.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>6. Beta Program</h2>
              <p>
                A limited number of users may be granted access to a free beta program at our sole
                discretion. Beta access is revocable at any time. Features, performance, accuracy,
                and availability during beta are not guaranteed.
              </p>
              <p>
                When paid plans are introduced, Beta and Original Users will receive a promotional
                membership offer equal to 66% off the first year, subject to the terms communicated
                at that time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>7. Pricing &amp; Payments</h2>
              <p>
                Pricing is not listed in these Terms and may change at any time. Promotional pricing
                may apply for a limited introductory period. Regular pricing applies thereafter.
                Annual price increases may occur after the first year. There is no long-term
                contract. You may cancel at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>8. No Refunds / No Chargebacks</h2>
              <p>
                All payments are final. There are no refunds, chargebacks, or payment disputes.
                Services are deemed rendered and provided at the time of payment, regardless of usage
                or results.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>9. User Responsibilities</h2>
              <p>
                You are responsible for maintaining accurate Buy Box preferences, managing
                wholesalers and data sources through the website menu, and ensuring you have the
                right to submit any third-party data or communications. WholesaleDealFinder.ai is not
                responsible for missing, delayed, filtered, or inaccurate information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>10. No Warranties</h2>
              <p>
                The service is provided “as is” and “as available.” We make no guarantees regarding
                deal availability, accuracy, profitability, timeliness, or results of any kind.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>11. Prohibited Use – Competitors</h2>
              <p>
                Competitors are strictly prohibited from using the website or services. A Competitor
                includes any individual or entity that offers, develops, or intends to offer
                substantially similar AI-based deal filtering, monitoring, notification, aggregation,
                or prioritization services. Any such use constitutes a material breach of these
                Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>12. Intellectual Property</h2>
              <p>
                All software, content, workflows, AI logic, formatting language, layouts, and
                processes are the exclusive property of WholesaleDealFinder.ai and its licensors.
                Unauthorized use is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>13. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, WholesaleDealFinder.ai shall not be liable
                for indirect, incidental, consequential, or special damages. Total liability shall
                not exceed the amount paid by the user in the thirty (30) days preceding the claim.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>14. Termination</h2>
              <p>
                We may suspend or terminate access at any time, for any reason, with or without
                notice. Upon termination, all licenses granted under these Terms immediately cease.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>15. Governing Law &amp; Venue</h2>
              <p>
                These Terms are governed by the laws of the State of Florida. Any dispute shall be
                brought exclusively in Broward County, Florida.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>16. Modifications</h2>
              <p>
                We may update these Terms at any time. Continued use of the website constitutes
                acceptance of the revised Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className={headingClass}>17. Contact</h2>
              <p>
                For any questions or requests, please contact{' '}
                <a
                  href="mailto:iamthemanagerllc@gmail.com"
                  className="underline font-bold text-blue-600"
                >
                  iamthemanagerllc@gmail.com
                </a>
                .
              </p>
            </section>

            <section className="space-y-6">
              <h2 className={headingClass}>18. SMS Messaging</h2>

              <div className="space-y-3">
                <h3
                  className={`text-base font-black uppercase tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  18.1 SMS For Consent Communication
                </h3>
                <p>
                  The Phone Numbers obtained as part of the SMS consent process will not be shared
                  with third parties for marketing purposes.
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className={`text-base font-black uppercase tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  18.2 Types of SMS Communications
                </h3>
                <p>
                  If you have consented to receive text messages from WholesaleDealFinder.ai, you
                  may receive text messages related to appointment reminders, meetings, and
                  follow-up on cases.
                </p>
                <p>
                  For Example: Hello, thank you for contacting WholesaleDealFinder.ai. How can we
                  help you? Reply STOP to opt-out at any time. Message and data rates may apply. For
                  assistance, text HELP or visit our{' '}
                  <Link to="/privacy-policy" className="underline font-bold text-blue-600">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/terms-of-service" className="underline font-bold text-blue-600">
                    Terms of Service
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className={`text-base font-black uppercase tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  18.3 Message Frequency
                </h3>
                <p>
                  Our SMS message frequency will be from 50 to 1000 text messages daily across all
                  users.
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className={`text-base font-black uppercase tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  18.4 Potential Fees for SMS Messaging
                </h3>
                <p>
                  Many carriers charge a fee for each message sent or received. This can vary
                  depending on the carrier’s pricing structure and whether the message is sent
                  domestically or internationally.
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className={`text-base font-black uppercase tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  18.5 Opt-In Method
                </h3>
                <p>
                  Customer will Opt-In for SMS messaging from WholesaleDealFinder.ai through intake
                  forms on their website located at{' '}
                  <a
                    href="https://www.wholesaledealfinder.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold text-blue-600"
                  >
                    www.wholesaledealfinder.ai
                  </a>
                  . This agreement for SMS will not be shared with third parties for marketing
                  purposes.
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className={`text-base font-black uppercase tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  18.6 Opt-out
                </h3>
                <p>
                  Customer will be able to opt out of SMS messaging from WholesaleDealFinder.ai by
                  replying STOP at any time to any received SMS message. Once opted-out they will
                  receive no further SMS communication. They can Opt back In at any time by
                  replying START.
                </p>
              </div>
            </section>

            <p className="pt-4">
              Also see our{' '}
              <Link to="/privacy-policy" className="underline font-bold text-blue-600">
                Privacy Policy
              </Link>
              .
            </p>
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

export default TermsOfService;
