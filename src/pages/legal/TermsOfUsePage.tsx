
import { useEffect } from "react";

export default function TermsOfUsePage() {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Terms of Use</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Effective Date: {effectiveDate}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            By accessing or using MediSnap, you agree to be bound by these Terms of Use and our Privacy Policy.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2. Description of Service</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            MediSnap is a medication management platform that provides tools for organizing medications,
            setting reminders, tracking adherence, and generating health reports. The service may include AI-powered
            features for medication identification and personalized recommendations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">3. User Accounts and Registration</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To use certain features of our service, you may be required to register for an account. You agree to:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Be responsible for all activities that occur under your account</li>
            <li>Promptly notify us of any unauthorized use of your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4. Medical Disclaimer</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            MediSnap is not intended to provide medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or other qualified health provider with any questions
            regarding a medical condition. Never disregard professional medical advice or delay seeking it
            because of something you have read on our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">5. User Content</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You retain all rights to any content you submit, post, or display on or through our service.
            By submitting content, you grant MediSnap a worldwide, non-exclusive, royalty-free license
            to use, copy, modify, and display that content in connection with the services we provide to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">6. Privacy</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your privacy is important to us. Our <a href="/privacy-policy" className="text-blue-500 hover:text-blue-600">Privacy Policy</a> explains 
            how we collect, use, and protect your personal information. By using MediSnap, you agree to our 
            data practices as described in the Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7. Limitation of Liability</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To the maximum extent permitted by law, MediSnap and its affiliates shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or
            use of or inability to access or use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">8. Changes to Terms</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We reserve the right to modify these Terms of Use at any time. We will provide notice of significant
            changes by posting a notice on our website or sending you an email. Your continued use of MediSnap
            after such modifications will constitute your acknowledgment and acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about these Terms of Use, please contact us:<br />
            📧 <a href="mailto:info@ailifestyle.tech" className="text-blue-500 hover:text-blue-600">info@ailifestyle.tech</a><br />
            🏢 Flat A-1 & A-2, House No. 4, Road No. 1, Chanduddan Avenue, Mohammadpur, Dhaka - 1207, Bangladesh
          </p>
        </section>
      </div>
    </div>
  );
}
