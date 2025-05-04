
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            By accessing or using NutriSnap, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2. Account Responsibilities</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You are responsible for:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring information provided is accurate and up-to-date</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">3. Medical Disclaimer</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            NutriSnap is not intended to provide medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or other qualified health provider with any questions
            regarding a medical condition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about these Terms, please contact us:<br />
            📧 <a href="mailto:legal@nutrisnap.app" className="text-green-500 hover:text-green-600">legal@nutrisnap.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
