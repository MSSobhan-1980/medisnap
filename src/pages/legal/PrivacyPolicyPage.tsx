
import { useEffect } from "react";

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Effective Date: {effectiveDate}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Introduction</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Welcome to NutriSnap ("NutriSnap", "we", "our", or "us").
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This Privacy Policy explains how we collect, use, and protect your personal information when you use the NutriSnap app and associated services.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            By using NutriSnap, you agree to the terms outlined here.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Information We Collect</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Personal Information</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Age (optional)</li>
              <li>Account credentials (email/password)</li>
              <li>Subscription status and payment details (via Stripe)</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">App-Specific Data</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
              <li>Uploaded meal photos</li>
              <li>Detected food groups and nutrition breakdowns</li>
              <li>Meal logs and user progress (calorie intake, macros tracking)</li>
              <li>Goal settings (e.g., weight loss, muscle gain)</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Device and Log Information</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
              <li>Device type and OS version</li>
              <li>IP address</li>
              <li>Browser type (for web app users)</li>
              <li>Usage behavior and interactions</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Cookies and Analytics</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1 mb-4">
            <li>Maintain login sessions</li>
            <li>Measure engagement and app performance</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            You can learn more about how we use cookies in our <a href="/cookie-policy" className="text-green-500 hover:text-green-600">Cookie Policy</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">How We Use Information</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Provide nutrition analysis and progress tracking</li>
            <li>Personalize recommendations and healthy eating advice</li>
            <li>Communicate important service updates</li>
            <li>Process subscriptions and billing</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Sharing of Information</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">We only share your data in limited ways:</p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1 mb-4">
            <li>Service providers (Stripe, Supabase, OpenAI) for operational support</li>
            <li>Analytics providers (for improving app performance)</li>
            <li>Legal authorities (if required)</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>We never sell your personal data.</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Your Rights</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1 mb-4">
            <li>Access, update, or delete your personal data</li>
            <li>Request a copy of your data (portability)</li>
            <li>Withdraw consent for non-essential data usage</li>
            <li>Manage cookie preferences</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            To exercise your rights, email:<br />
            📧 <a href="mailto:privacy@nutrisnap.app" className="text-green-500 hover:text-green-600">privacy@nutrisnap.app</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Security Measures</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Data encryption (at rest and in transit)</li>
            <li>Secure authentication</li>
            <li>Regular system audits</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">International Data Transfers</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Data may be stored and processed across different countries.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            We ensure compliance with GDPR, CCPA, and other international laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Changes to This Policy</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Any updates will be communicated via email or app notifications.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Questions? Contact:<br />
            📧 <a href="mailto:info@ailifestyle.app" className="text-green-500 hover:text-green-600">info@ailifestyle.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
