
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Send, Briefcase } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message received!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions about NutriSnap? Want to give feedback or report an issue? 
          We're here to help. Reach out to our team using any of the methods below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Email</h3>
          <p className="text-gray-500 mb-4">Our friendly team is here to help.</p>
          <a href="mailto:info@ailifestyle.app" className="text-green-600 hover:text-green-700 font-medium">
            info@ailifestyle.app
          </a>
        </Card>
        
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Office</h3>
          <p className="text-gray-500 mb-4">Come say hello at our office.</p>
          <p className="text-gray-600">
            825 Tech Boulevard, Suite 300<br />
            San Francisco, CA 94107
          </p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <Phone className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Phone</h3>
          <p className="text-gray-500 mb-4">Mon-Fri from 8am to 5pm.</p>
          <a href="tel:+15553452678" className="text-green-600 hover:text-green-700 font-medium">
            +1 (555) 345-2678
          </a>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={6}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Join our team</h2>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="ml-3 text-xl font-semibold">Careers</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals to join our growing team. Check out our current openings or send us your resume.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg">AI Developer</h4>
                <p className="text-gray-500 text-sm mb-2">Full-time • Remote</p>
                <p className="text-gray-600">
                  Join our ML team to improve our food recognition algorithms.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg">UX/UI Designer</h4>
                <p className="text-gray-500 text-sm mb-2">Full-time • San Francisco</p>
                <p className="text-gray-600">
                  Help us create the best nutrition tracking experience.
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="mt-6 w-full">
              View all positions
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
