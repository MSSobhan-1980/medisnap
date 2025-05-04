
import { useEffect } from "react";

export default function CookiePolicyPage() {
  const effectiveDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Cookie Policy</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Effective Date: {effectiveDate}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Introduction</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            NutriSnap uses cookies and similar technologies to improve your experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">What Are Cookies?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Cookies are small text files placed on your device to collect standard internet log information and visitor behavior information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">How We Use Cookies</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Authentication (keep you logged in)</li>
            <li>Analytics (understand usage and improve the app)</li>
            <li>Remembering your preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Types of Cookies Used</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Essential Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You may disable these by changing your browser settings, but this may affect how the website functions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Analytics Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and your experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Functionality Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                These cookies enable enhanced functionality and personalization, such as language preferences, dark/light mode settings, and remembering your settings between visits.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Managing Cookies</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>You can control cookies through your browser settings.</li>
            <li>You can opt-out of non-essential cookies via the cookie banner when first accessing NutriSnap.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Third-Party Cookies</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Stripe Cookies (payment interface)</li>
            <li>OpenAI Services (where applicable)</li>
            <li>Analytics providers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Changes to the Cookie Policy</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We will update this Cookie Policy if there are significant changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Questions about cookies?<br />
            📧 <a href="mailto:info@ailifestyle.app" className="text-green-500 hover:text-green-600">info@ailifestyle.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
