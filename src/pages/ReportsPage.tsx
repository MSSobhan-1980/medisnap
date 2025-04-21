
import { useState } from "react";
import { Calendar, ChevronDown, Download, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsPage() {
  const [activePatient, setActivePatient] = useState("self");
  const [activeTab, setActiveTab] = useState("adherence");
  
  // Mock data for patients
  const patients = [
    { id: "self", name: "Jane Smith (You)" },
    { id: "parent", name: "Robert Smith" },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Health Reports</h1>
          <p className="text-gray-500">Track your medication adherence and health trends</p>
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
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="adherence">
            Adherence Report
          </TabsTrigger>
          <TabsTrigger value="history">
            Medication History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="adherence">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Overall Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">87%</div>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Morning Meds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <p className="text-xs text-gray-500">6AM - 12PM</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Afternoon Meds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">84%</div>
                <p className="text-xs text-gray-500">12PM - 6PM</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Evening Meds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">78%</div>
                <p className="text-xs text-gray-500">6PM - 12AM</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Adherence Trend</CardTitle>
                  <CardDescription>How consistently you've taken your medications</CardDescription>
                </div>
                <select className="bg-transparent border px-2 py-1 rounded text-sm">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Placeholder for adherence chart */}
              <div className="h-64 bg-gray-50 rounded-lg border flex items-center justify-center">
                <p className="text-gray-400">Adherence chart visualization would appear here</p>
                {/* In a real app, this would be a chart showing adherence trends */}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medication-Specific Adherence</CardTitle>
              <CardDescription>Breakdown by medication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["Aspirin", "Metformin", "Lisinopril", "Vitamin D"].map((med, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{med}</span>
                      <span className="text-gray-500">{90 - i * 5}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${i % 2 === 0 ? 'bg-medsnap-blue' : 'bg-medsnap-green'}`}
                        style={{ width: `${90 - i * 5}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button className="w-full bg-medsnap-blue hover:bg-blue-600">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medication History</CardTitle>
                  <CardDescription>Complete record of your medication intake</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Filter by Date
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Medication</th>
                      <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Dosage</th>
                      <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Time</th>
                      <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      {
                        date: "Apr 21, 2025",
                        medication: "Aspirin",
                        dosage: "100mg",
                        time: "08:00 AM",
                        status: "Taken"
                      },
                      {
                        date: "Apr 21, 2025",
                        medication: "Vitamin D",
                        dosage: "1000 IU",
                        time: "09:30 AM",
                        status: "Missed"
                      },
                      {
                        date: "Apr 20, 2025",
                        medication: "Aspirin",
                        dosage: "100mg",
                        time: "08:00 AM",
                        status: "Taken"
                      },
                      {
                        date: "Apr 20, 2025",
                        medication: "Vitamin D",
                        dosage: "1000 IU",
                        time: "09:30 AM",
                        status: "Taken"
                      },
                      {
                        date: "Apr 20, 2025",
                        medication: "Metformin",
                        dosage: "500mg",
                        time: "01:00 PM",
                        status: "Taken"
                      },
                      {
                        date: "Apr 20, 2025",
                        medication: "Lisinopril",
                        dosage: "10mg",
                        time: "08:00 PM",
                        status: "Taken"
                      },
                      {
                        date: "Apr 19, 2025",
                        medication: "Aspirin",
                        dosage: "100mg",
                        time: "08:15 AM",
                        status: "Taken"
                      }
                    ].map((record, i) => (
                      <tr key={i} className="text-sm">
                        <td className="py-4 px-2">{record.date}</td>
                        <td className="py-4 px-2 font-medium">{record.medication}</td>
                        <td className="py-4 px-2">{record.dosage}</td>
                        <td className="py-4 px-2">{record.time}</td>
                        <td className="py-4 px-2">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.status === 'Taken' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing 7 of 124 entries
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Missed Dose Analysis</CardTitle>
                <CardDescription>Understand patterns in missed doses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Most Frequently Missed</div>
                    <div className="font-medium">Evening Medications (8:00 PM)</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Common Reason</div>
                    <div className="font-medium">Forgot / Was busy</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Suggestion</div>
                    <div className="font-medium">Set backup reminder 15 minutes after initial alert</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Medication Impact</CardTitle>
                <CardDescription>Long-term medication effectiveness</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-10">
                <div className="text-gray-500 mb-4">
                  <Users className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4">
                    Upgrade to Pro+ to access medication impact analysis and health trends
                  </p>
                </div>
                <Button className="mt-2">Upgrade Now</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
