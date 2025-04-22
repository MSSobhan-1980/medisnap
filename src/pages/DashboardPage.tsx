
import { useState } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Calendar component imports
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("daily");
  const [activePatient, setActivePatient] = useState("self");
  
  // Mock data for patients
  const patients = [
    { id: "self", name: "Jane Smith (You)" },
    { id: "parent", name: "Robert Smith" },
  ];

  // Mock medication data for the selected date
  const medications = [
    {
      id: 1,
      name: "Aspirin",
      dosage: "100mg",
      time: "08:00",
      status: "taken",
      patient: "self",
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1000 IU",
      time: "09:30",
      status: "missed",
      patient: "self",
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      time: "13:00",
      status: "pending",
      patient: "self",
    },
    {
      id: 4,
      name: "Lisinopril",
      dosage: "10mg",
      time: "20:00",
      status: "pending", 
      patient: "self",
    },
    {
      id: 5,
      name: "Amlodipine",
      dosage: "5mg",
      time: "10:00",
      status: "taken",
      patient: "parent",
    },
    {
      id: 6,
      name: "Metoprolol",
      dosage: "50mg",
      time: "10:00",
      status: "taken",
      patient: "parent",
    },
    {
      id: 7,
      name: "Furosemide",
      dosage: "20mg",
      time: "18:00",
      status: "pending",
      patient: "parent",
    },
  ];

  // Filter medications based on the active patient
  const filteredMedications = medications.filter(med => med.patient === activePatient);

  // Format date for display
  const formattedDate = date ? format(date, "PPP") : "";
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Medication Dashboard</h1>
          <p className="text-gray-500">Track your medication schedule and history</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <select 
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-medsnap-blue focus:border-transparent"
            value={activePatient}
            onChange={(e) => setActivePatient(e.target.value)}
          >
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
      </div>
      
      {/* Calendar section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view medications</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-6">
              <div className="text-lg font-semibold mb-2">
                {date ? formattedDate : "Select a date"}
              </div>
              <div className="text-gray-500">
                {filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500">
                    {filteredMedications.filter(m => m.status === "taken").length} Taken
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-500">
                    {filteredMedications.filter(m => m.status === "pending").length} Pending
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-500">
                    {filteredMedications.filter(m => m.status === "missed").length} Missed
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Medication Schedule</CardTitle>
                <CardDescription>For {formattedDate}</CardDescription>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab}>
              <TabsContent value="daily" className="mt-0">
                {filteredMedications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No medications scheduled for this day</p>
                    <Button className="mt-4">Add Medication</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center py-2 border-b text-sm font-medium text-gray-500">
                      <div>Time</div>
                      <div>Medication</div>
                      <div>Status</div>
                    </div>
                    {filteredMedications
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((med) => (
                        <div 
                          key={med.id} 
                          className="grid grid-cols-[auto,1fr,auto] gap-4 items-center py-3 border-b last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{med.time}</span>
                          </div>
                          <div>
                            <div className="font-medium">{med.name}</div>
                            <div className="text-sm text-gray-500">{med.dosage}</div>
                          </div>
                          <div>
                            {med.status === 'taken' ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Taken</span>
                              </div>
                            ) : med.status === 'missed' ? (
                              <div className="flex items-center text-red-600">
                                <XCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Missed</span>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm">
                                Mark as Taken
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="weekly" className="mt-0">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Weekly View</h3>
                  <p className="text-gray-500 mb-4">
                    Track your medications over the week at a glance
                  </p>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div key={i} className="text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    {Array(7).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-16 border rounded-md ${
                          i === 2 ? 'bg-white border-medsnap-blue' : 'bg-white'
                        } flex flex-col justify-center items-center`}
                      >
                        <div className="text-xs">{i + 1}</div>
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1"></div>
                      </div>
                    ))}
                  </div>
                  <Button className="bg-medsnap-blue hover:bg-blue-600">
                    View Detailed Weekly Report
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="monthly" className="mt-0">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Monthly View</h3>
                  <p className="text-gray-500 mb-4">
                    See your monthly medication adherence statistics
                  </p>
                  <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 rounded-full border-8 border-medsnap-blue flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">87%</div>
                        <div className="text-xs text-gray-500">Adherence</div>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-medsnap-blue hover:bg-blue-600">
                    Generate Monthly Report
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Medication Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-medsnap-blue">87%</div>
            <p className="text-sm text-gray-500">Last 30 days</p>
            <div className="h-2 bg-gray-100 rounded-full mt-4">
              <div 
                className="h-2 bg-medsnap-blue rounded-full" 
                style={{ width: '87%' }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Medications Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{medications.filter(m => m.patient === activePatient).length}</div>
            <p className="text-sm text-gray-500">
              {activePatient === 'self' ? 'Your' : 'Their'} medications
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">View All</Button>
              <Button size="sm">Add New</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Refills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">2</div>
            <p className="text-sm text-gray-500">In the next 7 days</p>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View Refill Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
