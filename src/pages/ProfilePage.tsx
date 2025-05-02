
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRound, Settings, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import ProfileEditor from "@/components/ProfileEditor";
import FamilyMemberSelector from "@/components/FamilyMemberSelector";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Use profile data from Supabase, fallback to user email if needed
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    "Unknown User";
  const displayEmail =
    user?.email || "unknown@example.com";
  const avatarUrl = profile?.avatar_url || "";

  const handleProfileSaved = () => {
    setShowEditor(false);
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center mb-4 md:mb-8 justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
        <FamilyMemberSelector />
      </div>

      {/* Profile Summary Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="text-2xl bg-medsnap-blue text-white">
                {displayName.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="text-gray-500">{displayEmail}</p>
              <div className="inline-block bg-medsnap-grey px-3 py-1 rounded-full text-sm font-medium mt-2">
                Basic Plan
              </div>
            </div>
            <div className="flex-grow"></div>
            <Button variant="outline" className="md:self-start" onClick={() => setShowEditor(!showEditor)}>
              <Settings className="mr-2 h-4 w-4" /> {showEditor ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>
          
          {showEditor && (
            <div className="mt-6">
              <ProfileEditor onSave={handleProfileSaved} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="account">
            <UserRound className="mr-2 h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="mr-2 h-4 w-4" /> Subscription
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
                      <div className="text-gray-900">{displayName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                      <div className="text-gray-900">{displayEmail}</div>
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
                        <h4 className="font-semibold text-xl">Basic Plan</h4>
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
      </Tabs>
    </div>
  );
}
