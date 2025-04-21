
import { useState } from "react";
import { UserRound, Settings, CreditCard, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account");

  // Mock user data
  const user = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "",
    plan: "Free Plan",
    patients: [
      { id: 1, name: "Jane Smith (You)", relation: "self" },
      { id: 2, name: "Robert Smith", relation: "parent" },
    ]
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Profile</h1>
      
      {/* Profile Summary Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl bg-medsnap-blue text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="inline-block bg-medsnap-grey px-3 py-1 rounded-full text-sm font-medium mt-2">
                {user.plan}
              </div>
            </div>
            
            <div className="flex-grow"></div>
            
            <Button variant="outline" className="md:self-start">
              <Settings className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="account">
            <UserRound className="mr-2 h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="mr-2 h-4 w-4" /> Subscription
          </TabsTrigger>
          <TabsTrigger value="patients">
            <Users className="mr-2 h-4 w-4" /> Patients
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Name</label>
                      <div className="text-gray-900">{user.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                      <div className="text-gray-900">{user.email}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Notification Settings
                      </label>
                      <Button variant="outline" size="sm">Manage Notifications</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Password</label>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your subscription plan and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Current Plan</h3>
                  <div className="mt-4 p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <h4 className="font-semibold text-xl">{user.plan}</h4>
                        <p className="text-gray-500 mt-1">
                          Basic features with limited medication scanning
                        </p>
                      </div>
                      <Button className="mt-4 md:mt-0 bg-medsnap-blue hover:bg-blue-600">
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Available Plans</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                    {/* Free Plan */}
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <CardDescription>$0/week</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-bold text-2xl mb-4">$0</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Scan up to 5 medications
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Daily reminders
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Refill alerts
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Basic dashboard view
                          </li>
                        </ul>
                        <Button variant="outline" className="w-full mt-6" disabled>
                          Current Plan
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {/* Pro Plan */}
                    <Card className="border-2 border-medsnap-blue">
                      <CardHeader className="bg-medsnap-blue/10">
                        <div className="bg-medsnap-blue text-white text-xs font-medium px-2 py-1 rounded-full w-fit mb-2">
                          POPULAR
                        </div>
                        <CardTitle>Pro Plan</CardTitle>
                        <CardDescription>$9.99/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-bold text-2xl mb-4">$9.99<span className="text-sm font-normal">/month</span></p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Manage up to 20 meds
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Advanced scheduling
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Unlimited refill & expiry reminders
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Weekly adherence reports
                          </li>
                        </ul>
                        <Button className="w-full mt-6 bg-medsnap-blue hover:bg-blue-600">
                          Upgrade to Pro
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {/* Pro+ Plan */}
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>Pro+ Plan</CardTitle>
                        <CardDescription>$19.99/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-bold text-2xl mb-4">$19.99<span className="text-sm font-normal">/month</span></p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Everything in Pro
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Up to 50 medications
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Drug interaction checks
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Monthly health reports (PDF)
                          </li>
                          <li className="flex items-start">
                            <span className="text-medsnap-blue mr-2">✓</span>
                            Caregiver mode (multiple profiles)
                          </li>
                        </ul>
                        <Button className="w-full mt-6">
                          Upgrade to Pro+
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Profiles</CardTitle>
              <CardDescription>Manage medication schedules for yourself and others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Patients</h3>
                  <Button size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Add Patient
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.patients.map((patient) => (
                    <Card key={patient.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-medsnap-blue text-white">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">
                              {patient.name}
                            </h4>
                            <p className="text-sm text-gray-500 capitalize">
                              {patient.relation}
                            </p>
                          </div>
                          <div className="flex-grow"></div>
                          <Button variant="outline" size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500 mb-2">
                    <span className="block font-medium text-gray-700 mb-1">Caregiver Mode</span>
                    Upgrade to Pro+ to manage medication for up to 5 family members
                  </p>
                  <Button className="mt-2">Upgrade to Pro+</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
