import { useEffect } from "react";

export default function TermsOfServicePage() {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Effective Date: {effectiveDate}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Welcome</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Welcome to NutriSnap!
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            By using our app and services, you agree to these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Use of the App</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our service is intended for personal, non-commercial use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            For any inquiries regarding these Terms:<br />
            📧 <a href="mailto:info@ailifestyle.app" className="text-green-500 hover:text-green-600">info@ailifestyle.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
