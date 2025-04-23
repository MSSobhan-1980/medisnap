import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Calendar, Bell, RefreshCcw, AlertTriangle, BarChart4, Users, Clock, CheckCircle, AlertCircle, UserRound } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Manage Medications with <span className="text-blue-500">AI Precision</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Upload a photo of your prescription or medication and let our AI organize 
              everything for you. Smart reminders, tracking, and health insights in one app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/scan">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6">
                  <Camera className="mr-2 h-5 w-5" /> Scan Medication
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="h-12 px-6">
                  View Dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gray-200"></div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-500">
                Join 5,000+ users managing medications with ease
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/public/lovable-uploads/ad095721-ae86-4ce0-b72c-417bf79d1250.png"
                alt="MedSnap AI App Interface"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Features for Better Medication Management</h2>
            <p className="text-gray-600 mt-4">MedSnap uses AI to make managing medications simple, safe, and effective.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border shadow-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <Camera className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Snap to Organize</h3>
                <p className="text-gray-600">
                  Upload a photo of your prescription or pill bottle. Our AI extracts medication details automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
                <p className="text-gray-600">
                  View your medication calendar with daily, weekly, and monthly views. Stay on track with your regimen.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Alert System</h3>
                <p className="text-gray-600">
                  Receive timely push notifications and sound alerts so you never miss a dose.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <RefreshCcw className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Refill Reminders</h3>
                <p className="text-gray-600">
                  Get notified before your medications run out and track expiry dates.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <AlertTriangle className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interaction Warnings</h3>
                <p className="text-gray-600">
                  Premium feature that checks for potential drug interactions to keep you safe.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <BarChart4 className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Health Reports</h3>
                <p className="text-gray-600">
                  Generate visual charts showing your medication compliance and exportable PDF reports.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Making Medication Management <span className="text-blue-500">Effortless</span></h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border shadow-sm text-center">
              <CardContent className="pt-8 pb-8">
                <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-1">120,000+</div>
                <p className="text-gray-500">Active Users</p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm text-center">
              <CardContent className="pt-8 pb-8">
                <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-1">35%</div>
                <p className="text-gray-500">Improved Adherence</p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm text-center">
              <CardContent className="pt-8 pb-8">
                <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-1">25,000+</div>
                <p className="text-gray-500">Interactions Prevented</p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm text-center">
              <CardContent className="pt-8 pb-8">
                <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-1">4.8/5</div>
                <p className="text-gray-500">User Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="text-gray-600 mt-4">
              Discover how MedSnap is transforming medication management for caregivers and patients alike.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border shadow-sm bg-gray-50">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
                    S
                  </div>
                  <div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-3">
                      "MedSnap has been a lifesaver for managing my father's medications. The ability to scan his prescriptions and get automatic reminders ensures he never misses a dose."
                    </p>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Caregiver</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <button key={i} className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Choose Your Plan</h2>
            <p className="text-gray-600 mt-4">
              Select the perfect plan for your medication management needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border shadow-sm">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-500 ml-1">/week</span>
                </div>
                <p className="text-gray-600 mb-6">Basic medication management for individual users</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Scan up to 3 medications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Daily reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Refill alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic dashboard view</span>
                  </li>
                </ul>
                
                <Button className="w-full">Get Started Free</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border shadow-sm relative">
              <div className="absolute top-0 inset-x-0 bg-blue-500 text-white text-center py-1 text-sm">
                Most Popular
              </div>
              <CardContent className="pt-12 pb-8">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Enhanced features for active medication management</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manage up to 20 medications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Daily reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Refill alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced dashboard view</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Weekly adherence reports</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Upgrade to Pro</Button>
              </CardContent>
            </Card>

            {/* Pro+ Plan */}
            <Card className="border shadow-sm">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-xl font-semibold mb-2">Pro+</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">$19.99</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Complete solution for families and caregivers</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manage up to 50 medications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Daily reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Refill alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced dashboard view</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Monthly health reports (PDF)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Drug interaction checks</span>
                  </li>
                </ul>
                
                <Button className="w-full">Upgrade to Pro+</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Ready to Simplify Your Medication Management?</h2>
            <p className="text-gray-600 mt-4">
              Join thousands of users who have transformed how they manage their prescriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-4">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-gray-700">Never miss a dose again</span>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-gray-700">Scan medications in seconds</span>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-4">
                <BarChart4 className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-gray-700">Track your adherence progress</span>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-4">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-gray-700">Get alerts for potential drug interactions</span>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-4">
                <UserRound className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-gray-700">Manage medications for your loved ones</span>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-blue-500 hover:bg-blue-600 h-12 px-8 text-lg">
              Get Started for Free
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required. Free plan available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
