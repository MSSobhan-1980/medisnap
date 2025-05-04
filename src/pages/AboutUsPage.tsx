
import { useEffect } from "react";

export default function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">About MediSnap</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At MediSnap, our mission is to simplify medication management through innovative technology. 
            We believe everyone deserves accessible tools to manage their health effectively.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            MediSnap was founded by a team of healthcare professionals and technology experts who recognized 
            the challenges many people face in managing multiple medications. Our founders experienced firsthand 
            the complications that arise from medication mismanagement, either personally or with loved ones.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            After years of research and development, we created MediSnap - an AI-powered solution that 
            makes medication management intuitive and error-free for everyone.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Our Technology</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            MediSnap leverages cutting-edge artificial intelligence to identify medications from photos, 
            schedule reminders, and monitor adherence. Our platform is designed with security and privacy 
            as top priorities, ensuring your health information remains protected.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            We'd love to hear from you! Reach out with questions, feedback, or partnership inquiries.
          </p>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              📧 Email: <a href="mailto:info@ailifestyle.tech" className="text-blue-500 hover:text-blue-600">info@ailifestyle.tech</a>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              🏢 Address: Flat A-1 & A-2, House No. 4, Road No. 1, Chanduddan Avenue, Mohammadpur, Dhaka - 1207, Bangladesh
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
