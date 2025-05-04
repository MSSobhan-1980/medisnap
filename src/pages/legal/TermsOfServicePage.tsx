
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
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Intended for personal, non-commercial use.</li>
            <li>Users must be 16+ years old (or have parental consent).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Account Creation and Management</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Users must provide accurate information.</li>
            <li>You are responsible for maintaining account security.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Subscriptions and Billing</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Free and Paid (Pro, Pro+) plans available.</li>
            <li>Stripe handles secure payment processing.</li>
            <li>Subscriptions auto-renew unless canceled.</li>
            <li>No refunds for partial subscription periods unless required by law.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Ownership and Intellectual Property</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>NutriSnap's name, logo, app interface, and all underlying technology are the property of NutriSnap.</li>
            <li>You may not reproduce or distribute our content without permission.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">User-Generated Content</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>You own your uploaded meal photos and data.</li>
            <li>You grant NutriSnap a license to use your data solely for delivering services.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Third-Party Services</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            NutriSnap relies on:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1 mb-4">
            <li>OpenAI for meal analysis text generation</li>
            <li>Stripe for payment processing</li>
            <li>Supabase for database and storage</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            You are also subject to their terms of use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Limitations of Liability</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>NutriSnap is not liable for indirect damages or losses related to service interruptions or third-party services.</li>
            <li>Nutritional analysis provided is advisory only — not medical advice.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Termination</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>You may cancel your account anytime.</li>
            <li>NutriSnap reserves the right to suspend or terminate accounts violating these Terms.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Governing Law</h2>
          <p className="text-gray-600 dark:text-gray-300">
            These Terms are governed by the laws of the United States.
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
