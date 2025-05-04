
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      question: "What is MediSnap?",
      answer: "MediSnap is an AI-powered medication management application that helps you organize your medications, set reminders, track adherence, and monitor health outcomes. Our platform uses image recognition to identify medications and provides personalized schedules and reports."
    },
    {
      question: "How does the medication scanner work?",
      answer: "Our medication scanner uses advanced AI technology to identify medications from photos. Simply take a clear picture of your medication (pill, bottle, or package), and our system will identify it and add it to your medication list with relevant information."
    },
    {
      question: "Is my health information secure?",
      answer: "Absolutely. We take data security and privacy very seriously. All your health information is encrypted and stored securely. We comply with industry-standard security protocols and never share your data with third parties without your explicit consent."
    },
    {
      question: "Can I manage medications for family members?",
      answer: "Yes! MediSnap allows you to create family member profiles and manage medications for your loved ones. This is particularly helpful for caregivers managing medications for children, elderly parents, or other dependents."
    },
    {
      question: "How do I set up medication reminders?",
      answer: "After adding a medication to your profile, you can easily set up reminders by selecting the medication, choosing your preferred times, and setting the frequency. You can customize reminder types (notifications, emails) and set specific instructions for each medication."
    },
    {
      question: "Is MediSnap available on all devices?",
      answer: "MediSnap is a web-based application that works on any device with a modern web browser. You can access it from your smartphone, tablet, or computer for a seamless experience across all your devices."
    },
    {
      question: "How much does MediSnap cost?",
      answer: "MediSnap offers both free and premium subscription options. The basic features are available for free, while our premium subscription provides advanced features like unlimited medication tracking, priority support, and detailed health reports."
    },
    {
      question: "Who should I contact for support?",
      answer: "For any questions or assistance, please reach out to our support team at info@ailifestyle.tech or visit our support page to submit a request. We aim to respond to all inquiries within 24 hours."
    }
  ];

  const filteredFAQs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h1>
        
        <div className="relative mb-8">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" className="absolute right-0 top-0 h-full">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600 dark:text-gray-300">No results found for "{searchTerm}"</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </Button>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you couldn't find the information you were looking for, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <a href="/support">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:info@ailifestyle.tech">Email Us</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
