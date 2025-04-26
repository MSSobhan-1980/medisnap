import { useState } from "react";
import { Clock, CheckCircle, XCircle, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medication } from "@/types/medication";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface MedicationScheduleProps {
  medications: Medication[];
  loading: boolean;
  date: Date | undefined;
  onMarkAsTaken: (medicationId: string) => Promise<void>;
  onMarkAsMissed: (medicationId: string) => Promise<void>;
}

export default function MedicationSchedule({ 
  medications, 
  loading, 
  date,
  onMarkAsTaken,
  onMarkAsMissed
}: MedicationScheduleProps) {
  const [activeTab, setActiveTab] = useState("daily");
  const navigate = useNavigate();
  
  // Format date for display
  const formattedDate = date ? format(date, "PPP") : "";
  
  // Get timing label
  const getTimingLabel = (timing?: 'before_food' | 'with_food' | 'after_food') => {
    if (!timing) return null;
    
    switch (timing) {
      case 'before_food':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Before food</Badge>;
      case 'with_food':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">With food</Badge>;
      case 'after_food':
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">After food</Badge>;
      default:
        return null;
    }
  };

  return (
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
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              ))
            ) : medications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No medications scheduled for this day</p>
                <Button className="mt-4" onClick={() => navigate("/scan")}>Add Medication</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center py-2 border-b text-sm font-medium text-gray-500">
                  <div>Time</div>
                  <div>Medication</div>
                  <div>Status</div>
                </div>
                {medications
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
                        <div className="font-medium flex items-center gap-2">
                          <Pill className="h-4 w-4 text-medsnap-blue" />
                          {med.name}
                        </div>
                        <div className="text-sm text-gray-500">{med.dosage} - {med.frequency}</div>
                        {med.instructions && (
                          <div className="text-xs text-gray-500 mt-1">{med.instructions}</div>
                        )}
                        <div className="flex gap-1 mt-1">
                          {getTimingLabel(med.timing)}
                        </div>
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
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onMarkAsTaken(med.id)}
                            >
                              Taken
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => onMarkAsMissed(med.id)}
                            >
                              Missed
                            </Button>
                          </div>
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
  );
}
