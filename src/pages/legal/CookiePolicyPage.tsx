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
