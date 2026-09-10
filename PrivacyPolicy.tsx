import React from 'react';

const PrivacyPolicy: React.FC = () => (
  <main className="privacy-policy-page">
    <style>{`
      .privacy-policy-page {
        --ink: #1f2933;
        --muted: #5a6472;
        --accent: #0f6e5c;
        --accent-light: #e6f4f1;
        --border: #e2e8ec;
        --bg: #fafbfc;
        min-height: 100vh;
        box-sizing: border-box;
        color: var(--ink);
        background: var(--bg);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        line-height: 1.65;
      }
      .privacy-policy-page *, .privacy-policy-page *::before, .privacy-policy-page *::after { box-sizing: border-box; }
      .privacy-policy-page .wrapper { max-width: 820px; margin: 0 auto; padding: 48px 24px 96px; }
      .privacy-policy-page header { border-bottom: 3px solid var(--accent); padding-bottom: 24px; margin-bottom: 32px; }
      .privacy-policy-page h1 { font-size: 2rem; margin: 0 0 8px; color: var(--ink); }
      .privacy-policy-page .meta { color: var(--muted); font-size: 0.95rem; }
      .privacy-policy-page .owner-note { background: var(--accent-light); border-left: 4px solid var(--accent); padding: 14px 18px; border-radius: 4px; margin: 20px 0 0; font-size: 0.95rem; }
      .privacy-policy-page .toc { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 20px 24px; margin-bottom: 40px; }
      .privacy-policy-page .toc h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 0 0 12px; }
      .privacy-policy-page .toc ol { columns: 2; -webkit-columns: 2; padding-left: 20px; margin: 0; }
      .privacy-policy-page .toc li { margin-bottom: 6px; break-inside: avoid; }
      .privacy-policy-page .toc a, .privacy-policy-page .inline-link { color: var(--accent); text-decoration: none; }
      .privacy-policy-page .toc a { font-size: 0.92rem; }
      .privacy-policy-page .toc a:hover, .privacy-policy-page .inline-link:hover { text-decoration: underline; }
      .privacy-policy-page section { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 24px 28px; margin-bottom: 20px; }
      .privacy-policy-page section h2 { display: flex; align-items: center; gap: 10px; font-size: 1.15rem; color: var(--accent); margin: 0 0 12px; }
      .privacy-policy-page section h2 .num { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; color: #fff; background: var(--accent); font-size: 0.8rem; }
      .privacy-policy-page section h3 { font-size: 1rem; color: var(--ink); margin: 16px 0 8px; }
      .privacy-policy-page ul { padding-left: 22px; margin: 8px 0; }
      .privacy-policy-page li { margin-bottom: 4px; }
      .privacy-policy-page p { margin: 8px 0; }
      .privacy-policy-page .highlight-box { background: var(--accent-light); border-radius: 6px; padding: 14px 18px; margin-top: 10px; font-size: 0.95rem; }
      .privacy-policy-page .contact-card { background: var(--accent-light); border-radius: 6px; padding: 18px 22px; }
      .privacy-policy-page .contact-card p { margin: 4px 0; }
      .privacy-policy-page footer { margin-top: 40px; color: var(--muted); text-align: center; font-size: 0.85rem; }
      @media (max-width: 600px) { .privacy-policy-page .toc ol { columns: 1; -webkit-columns: 1; } }
    `}</style>

    <div className="wrapper">
      <header>
        <h1>Privacy Policy</h1>
        <div className="meta">Last Updated: September 2026</div>
        <div className="owner-note">
          <strong>Website Ownership:</strong> WholesaleDealFinder.ai (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is owned and operated by Wholesale Home Sales LLC.
        </div>
      </header>

      <nav className="toc" aria-label="Table of contents">
        <h2>On this page</h2>
        <ol>
          <li><a href="#s1">Introduction</a></li>
          <li><a href="#s2">Information We Collect</a></li>
          <li><a href="#s3">How We Use Your Information</a></li>
          <li><a href="#s4">No Sale or Sharing of Personal Information</a></li>
          <li><a href="#s5">No 3rd Party or Affiliate Marketing</a></li>
          <li><a href="#s6">Email Communications</a></li>
          <li><a href="#s7">Text Messaging (SMS)</a></li>
          <li><a href="#s8">Communication Preferences</a></li>
          <li><a href="#s9">Data Security</a></li>
          <li><a href="#s10">Data Retention</a></li>
          <li><a href="#s11">Third-Party Service Providers</a></li>
          <li><a href="#s12">Children&apos;s Privacy</a></li>
          <li><a href="#s13">Your Rights (Florida Residents)</a></li>
          <li><a href="#s14">Changes to This Privacy Policy</a></li>
          <li><a href="#s15">Contact Information</a></li>
        </ol>
      </nav>

      <section id="s1">
        <h2><span className="num">1</span>Introduction</h2>
        <p>WholesaleDealFinder.ai (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our website, services, email communications, and text messaging programs.</p>
        <p>This Privacy Policy is governed by and intended to comply with the laws of the State of Florida.</p>
      </section>

      <section id="s2">
        <h2><span className="num">2</span>Information We Collect</h2>
        <h3>A. Information You Provide</h3>
        <p>We may collect the following information that you voluntarily provide:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Account and Buy Box preferences</li>
          <li>Communication preferences</li>
        </ul>
        <h3>B. Automatically Collected Information</h3>
        <p>When you use our services, we may automatically collect:</p>
        <ul>
          <li>IP address</li>
          <li>Browser and device information</li>
          <li>Website usage and interaction data</li>
        </ul>
        <h3>C. Authorized Third-Party Data</h3>
        <p>We may process information from emails, chats, websites, or other sources that you explicitly authorize us to access or process.</p>
      </section>

      <section id="s3">
        <h2><span className="num">3</span>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and operate WholesaleDealFinder.ai</li>
          <li>Filter and deliver deal notifications</li>
          <li>Communicate service updates and promotional offers</li>
          <li>Improve our products and services</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>
      </section>

      <section id="s4">
        <h2><span className="num">4</span>No Sale or Sharing of Personal Information</h2>
        <p>We do not sell, rent, lease, trade, or share your personal information with third parties for marketing or data monetization purposes.</p>
      </section>

      <section id="s5">
        <h2><span className="num">5</span>No 3rd Party or Affiliate Marketing</h2>
        <p>No mobile information will be shared with third parties or affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.</p>
        <div className="highlight-box"><strong>SMS Privacy Notice:</strong> SMS opt-in information and phone numbers collected for SMS communications are not shared with any third party or affiliate company for marketing purposes.</div>
      </section>

      <section id="s6">
        <h2><span className="num">6</span>Email Communications</h2>
        <p>By creating an account, you consent to receive account-related and promotional emails from WholesaleDealFinder.ai. You may unsubscribe from non-essential promotional emails at any time using the unsubscribe link provided in those emails.</p>
      </section>

      <section id="s7">
        <h2><span className="num">7</span>Text Messaging (SMS) – TCPA &amp; Carrier Compliance</h2>
        <p>By opting into our SMS program, you consent to receive SMS or MMS messages from WholesaleDealFinder.ai.</p>
        <ul>
          <li>Message frequency may vary.</li>
          <li>Message and data rates may apply.</li>
          <li>Reply STOP to opt out.</li>
          <li>Reply HELP for assistance.</li>
        </ul>
        <p>All messaging complies with the Telephone Consumer Protection Act (TCPA) and applicable carrier requirements.</p>
      </section>

      <section id="s8">
        <h2><span className="num">8</span>Communication Preferences</h2>
        <p>You may update your email and SMS communication preferences at any time through your account settings or by contacting us directly.</p>
      </section>

      <section id="s9">
        <h2><span className="num">9</span>Data Security</h2>
        <p>We implement reasonable administrative, technical, and physical safeguards designed to protect your personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
      </section>

      <section id="s10">
        <h2><span className="num">10</span>Data Retention</h2>
        <p>We retain personal information only for as long as necessary to:</p>
        <ul>
          <li>Provide our services</li>
          <li>Fulfill contractual obligations</li>
          <li>Comply with applicable legal requirements</li>
          <li>Resolve disputes and enforce our agreements</li>
        </ul>
      </section>

      <section id="s11">
        <h2><span className="num">11</span>Third-Party Service Providers</h2>
        <p>We may use trusted third-party vendors to assist in operating our services. These providers are contractually required to protect your information and may only use it for the purposes for which it was provided.</p>
      </section>

      <section id="s12">
        <h2><span className="num">12</span>Children&apos;s Privacy</h2>
        <p>WholesaleDealFinder.ai is not intended for individuals under the age of 18, and we do not knowingly collect personal information from anyone under 18 years old.</p>
      </section>

      <section id="s13">
        <h2><span className="num">13</span>Your Rights (Florida Residents)</h2>
        <p>Subject to applicable law, Florida residents may request to:</p>
        <ul>
          <li>Access their personal information</li>
          <li>Correct inaccurate personal information</li>
          <li>Request deletion of personal information</li>
        </ul>
        <p>Certain requests may be subject to legal or regulatory exceptions.</p>
      </section>

      <section id="s14">
        <h2><span className="num">14</span>Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any updates will be posted on this page with a revised &quot;Last Updated&quot; date. Your continued use of WholesaleDealFinder.ai after changes become effective constitutes your acceptance of the updated Privacy Policy.</p>
      </section>

      <section id="s15">
        <h2><span className="num">15</span>Contact Information</h2>
        <div className="contact-card">
          <p><strong>WholesaleDealFinder.ai</strong></p>
          <p>Wholesale Home Sales LLC</p>
          <p>1314 East Las Olas Boulevard #642</p>
          <p>Fort Lauderdale, FL 33301</p>
          <p>Phone: <a className="inline-link" href="tel:7542001204">754-200-1204</a> | <a className="inline-link" href="tel:9544150122">954-415-0122</a></p>
          <p>Email: <a className="inline-link" href="mailto:iamthemanagerllc@gmail.com">iamthemanagerllc@gmail.com</a></p>
        </div>
      </section>

      <footer>© 2026 WholesaleDealFinder.ai — Wholesale Home Sales LLC. All rights reserved.</footer>
    </div>
  </main>
);

export default PrivacyPolicy;
