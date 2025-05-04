
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            NutriSnap collects personal information to provide and improve our services. This may include:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
            <li>Account information such as name and email address</li>
            <li>Health and nutrition data uploaded by you</li>
            <li>Device information and usage statistics</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We use your information to:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about updates and features</li>
            <li>Analyze usage patterns to improve our services</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">3. Your Data Rights</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us:<br />
            📧 <a href="mailto:privacy@nutrisnap.app" className="text-green-500 hover:text-green-600">privacy@nutrisnap.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
