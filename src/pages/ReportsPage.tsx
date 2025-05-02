
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMedications } from "@/hooks/useMedications";
import { ChevronDown, Download, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FamilyMemberSelector from "@/components/FamilyMemberSelector";

// Helper to calculate overall adherence rate
const calculateAdherence = (medications = []) => {
  if (!medications.length) return 0;
  
  const taken = medications.filter(med => med.status === 'taken').length;
  return Math.round((taken / medications.length) * 100);
};

export default function ReportsPage() {
  const { user, loading: authLoading, activeMember } = useAuth();
  const { medications, loading: medsLoading } = useMedications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("adherence");
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  // Filter medications by time of day
  const getMedicationsByTiming = (timing: string) => {
    return medications.filter(med => {
      // Determine if the medication is for the specified time of day
      if (timing === 'morning') {
        return med.timing === 'morning' || med.timing === 'before_food' || (med.time && med.time.toLowerCase().includes('am'));
      } else if (timing === 'afternoon') {
        return med.timing === 'afternoon' || med.timing === 'with_food' || (med.time && med.time.toLowerCase().includes('noon'));
      } else if (timing === 'evening') {
        return med.timing === 'evening' || med.timing === 'after_food' || (med.time && med.time.toLowerCase().includes('pm'));
      }
      return false;
    });
  };
  
  const morningMeds = getMedicationsByTiming('morning');
  const afternoonMeds = getMedicationsByTiming('afternoon');
  const eveningMeds = getMedicationsByTiming('evening');
  
  // Calculate adherence rates
  const overallAdherence = calculateAdherence(medications);
  const morningAdherence = calculateAdherence(morningMeds);
  const afternoonAdherence = calculateAdherence(afternoonMeds);
  const eveningAdherence = calculateAdherence(eveningMeds);
  
  // Get medication history (sorted by date)
  const medicationHistory = [...medications]
    .filter(med => med.updated_at)
    .sort((a, b) => {
      return new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime();
    });
  
  // Get unique medications for adherence breakdown
  const uniqueMedications = [...new Map(medications.map(med => [med.name, med])).values()];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Health Reports</h1>
          <p className="text-gray-500">Track your medication adherence and health trends</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <FamilyMemberSelector />
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
                <div className="text-3xl font-bold">{medsLoading ? "-" : `${overallAdherence}%`}</div>
                <p className="text-xs text-gray-500">All medications</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Morning Meds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{medsLoading ? "-" : `${morningAdherence}%`}</div>
                <p className="text-xs text-gray-500">Morning dose</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Afternoon Meds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{medsLoading ? "-" : `${afternoonAdherence}%`}</div>
                <p className="text-xs text-gray-500">Afternoon dose</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Evening Meds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{medsLoading ? "-" : `${eveningAdherence}%`}</div>
                <p className="text-xs text-gray-500">Evening dose</p>
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
              {medsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-400">Loading data...</p>
                </div>
              ) : medications.length === 0 ? (
                <div className="h-64 flex items-center justify-center flex-col">
                  <p className="text-gray-400 mb-2">No medication data available</p>
                  <Button onClick={() => navigate("/scan")} size="sm">
                    Add medications
                  </Button>
                </div>
              ) : (
                <div className="h-64 bg-gray-50 rounded-lg border flex items-center justify-center">
                  <p className="text-gray-400">Adherence chart visualization would appear here</p>
                  {/* In a real implementation, this would be a chart showing adherence over time */}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medication-Specific Adherence</CardTitle>
              <CardDescription>Breakdown by medication</CardDescription>
            </CardHeader>
            <CardContent>
              {medsLoading ? (
                <p className="text-center py-8 text-gray-400">Loading data...</p>
              ) : uniqueMedications.length === 0 ? (
                <p className="text-center py-8 text-gray-400">No medication data available</p>
              ) : (
                <div className="space-y-6">
                  {uniqueMedications.map((med, i) => {
                    // Calculate adherence for this specific medication
                    const medInstances = medications.filter(m => m.name === med.name);
                    const medAdherence = calculateAdherence(medInstances);
                    
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{med.name}</span>
                          <span className="text-gray-500">{medAdherence}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${i % 2 === 0 ? 'bg-medsnap-blue' : 'bg-medsnap-green'}`}
                            style={{ width: `${medAdherence}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
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
              {medsLoading ? (
                <div className="py-8 text-center">
                  <p className="text-gray-400">Loading medication history...</p>
                </div>
              ) : medicationHistory.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-400 mb-3">No medication history available</p>
                  <Button onClick={() => navigate("/scan")} size="sm">
                    Add medications
                  </Button>
                </div>
              ) : (
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
                      {medicationHistory.map((record, i) => {
                        const date = new Date(record.updated_at);
                        const formattedDate = date.toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric'
                        });
                        
                        return (
                          <tr key={i} className="text-sm">
                            <td className="py-4 px-2">{formattedDate}</td>
                            <td className="py-4 px-2 font-medium">{record.name}</td>
                            <td className="py-4 px-2">{record.dosage}</td>
                            <td className="py-4 px-2">{record.time}</td>
                            <td className="py-4 px-2">
                              <span 
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  record.status === 'taken' 
                                    ? 'bg-green-100 text-green-800'
                                    : record.status === 'missed'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {record.status === 'taken' ? 'Taken' : 
                                 record.status === 'missed' ? 'Missed' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {medicationHistory.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {Math.min(medicationHistory.length, 10)} of {medicationHistory.length} entries
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={medicationHistory.length <= 10}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Missed Dose Analysis</CardTitle>
                <CardDescription>Understand patterns in missed doses</CardDescription>
              </CardHeader>
              <CardContent>
                {medsLoading ? (
                  <p className="text-center py-8 text-gray-400">Loading data...</p>
                ) : medications.filter(m => m.status === 'missed').length === 0 ? (
                  <p className="text-center py-8 text-gray-400">No missed doses recorded</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Most Frequently Missed</div>
                      <div className="font-medium">
                        {(() => {
                          const missedMorning = medications.filter(m => m.status === 'missed' && (m.timing === 'morning' || (m.timing || '').includes('morning'))).length;
                          const missedAfternoon = medications.filter(m => m.status === 'missed' && (m.timing === 'afternoon' || (m.timing || '').includes('afternoon'))).length;
                          const missedEvening = medications.filter(m => m.status === 'missed' && (m.timing === 'evening' || (m.timing || '').includes('evening'))).length;
                          
                          if (missedMorning >= missedAfternoon && missedMorning >= missedEvening) {
                            return "Morning Medications";
                          } else if (missedAfternoon >= missedMorning && missedAfternoon >= missedEvening) {
                            return "Afternoon Medications";
                          } else {
                            return "Evening Medications";
                          }
                        })()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Suggestion</div>
                      <div className="font-medium">Set medication reminders to improve adherence</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Family Medication Overview</CardTitle>
                <CardDescription>Medication adherence for family members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-6 text-center">
                  <p className="text-gray-500 mb-4">
                    Use the family member selector to view medication reports for each family member
                  </p>
                  <FamilyMemberSelector />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
