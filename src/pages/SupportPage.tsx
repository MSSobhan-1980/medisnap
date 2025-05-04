import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Mail, Phone, MessageSquare, HelpCircle, Send, Info, FileText, Shield } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  issueType: z.string().min(1, { message: "Please select an issue type." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      issueType: '',
      message: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      // In a real app, this would connect to a backend API
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Support request submitted:', data);
      toast.success('Your support request has been submitted! We will contact you shortly.');
      form.reset();
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast.error('Failed to submit your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Support Center</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We're here to help! If you have any questions about MediSnap or need assistance,
          please reach out using one of the methods below.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Email Support
              </CardTitle>
              <CardDescription>
                Get help via email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href="mailto:info@ailifestyle.tech"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                info@ailifestyle.tech
              </a>
              <p className="text-gray-500 text-sm mt-2">
                We typically respond within 24 hours
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500" />
                Helpful Resources
              </CardTitle>
              <CardDescription>
                Quick self-service options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/faq">
                  <Info className="mr-2 h-4 w-4" />
                  Visit our FAQ
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/terms-of-use">
                  <FileText className="mr-2 h-4 w-4" />
                  Terms of Use
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/privacy-policy">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Policy
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Visit Us
              </CardTitle>
              <CardDescription>
                Our office location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-gray-600 dark:text-gray-300">
                Flat A-1 & A-2, House No. 4,<br />
                Road No. 1, Chanduddan Avenue,<br />
                Mohammadpur, Dhaka - 1207,<br />
                Bangladesh
              </address>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your issue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="issueType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an issue type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technical">Technical Problem</SelectItem>
                              <SelectItem value="account">Account Issue</SelectItem>
                              <SelectItem value="billing">Billing Question</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your issue in detail"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please include any relevant details that might help us resolve your issue faster.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                    {loading ? 'Submitting...' : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
