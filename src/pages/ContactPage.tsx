
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !message) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real implementation, you would send this to a backend service
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Your message has been sent! We'll get back to you soon.");
      
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
        <p className="text-gray-600">
          Have questions or feedback? We'd love to hear from you!
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="How can we help you?" 
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Other ways to reach us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Email</h3>
              <p>
                <a href="mailto:info@ailifestyle.app" className="text-green-600 hover:text-green-700">
                  info@ailifestyle.app
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Social Media</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-800">Twitter</a>
                <a href="#" className="text-gray-600 hover:text-gray-800">Facebook</a>
                <a href="#" className="text-gray-600 hover:text-gray-800">Instagram</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Hours</h3>
              <p className="text-gray-600">
                Our support team is available Monday-Friday from 9am to 5pm EST.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
