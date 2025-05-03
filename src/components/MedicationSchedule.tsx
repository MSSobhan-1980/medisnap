import { useState } from "react";
import { Clock, CheckCircle, XCircle, Pill, FileText, ListOrdered, Trash2, AlarmClock, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medication } from "@/types/medication";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditMedicationForm from "./EditMedicationForm";

interface MedicationScheduleProps {
  medications: Medication[];
  loading: boolean;
  date: Date | undefined;
  onMarkAsTaken: (medicationId: string) => Promise<void>;
  onMarkAsMissed: (medicationId: string) => Promise<void>;
  onDelete?: (medicationId: string) => Promise<void>;
}

export default function MedicationSchedule({ 
  medications, 
  loading, 
  date,
  onMarkAsTaken,
  onMarkAsMissed,
  onDelete
}: MedicationScheduleProps) {
  const [activeTab, setActiveTab] = useState("daily");
  const navigate = useNavigate();
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  // Format date for display
  const formattedDate = date ? format(date, "PPP") : "";
  
  // Get timing display
  const getTimingDisplay = (medication: Medication, period: 'morning' | 'afternoon' | 'evening') => {
    // Parse dosing pattern from notes
    const dosingPatternMatch = medication.notes?.match(/Dosing pattern: (\d\+\d\+\d)/);
    
    if (dosingPatternMatch) {
      const dosingPattern = dosingPatternMatch[1];
      const [morning, afternoon, evening] = dosingPattern.split("+").map(Number);
      
      const shouldTakeMorning = morning > 0 && period === 'morning';
      const shouldTakeAfternoon = afternoon > 0 && period === 'afternoon';
      const shouldTakeEvening = evening > 0 && period === 'evening';
      
      // Get the appropriate time for this period
      let timeDisplay = "";
      if (period === 'morning' && shouldTakeMorning) {
        timeDisplay = "08:00";
      } else if (period === 'afternoon' && shouldTakeAfternoon) {
        timeDisplay = "14:00";
      } else if (period === 'evening' && shouldTakeEvening) {
        timeDisplay = "20:00";
      }
      
      // If should take during this period, show check mark and time
      if ((period === 'morning' && shouldTakeMorning) || 
          (period === 'afternoon' && shouldTakeAfternoon) || 
          (period === 'evening' && shouldTakeEvening)) {
        
        const timingText = medication.timing ? 
          medication.timing.replace('_', ' ') : '';
        
        return (
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-500" />
              {timeDisplay && (
                <span className="text-gray-600 text-sm ml-1">{timeDisplay}</span>
              )}
            </div>
            {medication.timing && (
              <Badge variant="outline" className="mt-1 text-xs">
                {timingText}
              </Badge>
            )}
          </div>
        );
      }
      
      return "-";
    }
    
    // Fallback to time-based check if no dosing pattern
    const hour = parseInt(medication.time.split(':')[0], 10);
    const isMorning = hour >= 5 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 17;
    const isEvening = hour >= 17 || hour < 5;
    
    // Check if medication should be taken during this period
    const isInPeriod = 
      (period === 'morning' && isMorning) ||
      (period === 'afternoon' && isAfternoon) ||
      (period === 'evening' && isEvening);
    
    if (!isInPeriod) return "-";
    
    // Show time with timing if available
    const timingText = medication.timing ? 
      medication.timing.replace('_', ' ') : '';
    
    return (
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <AlarmClock className="h-3 w-3 mr-1 text-medsnap-blue" />
          <span>{medication.time}</span>
        </div>
        {medication.timing && (
          <Badge variant="outline" className="mt-1 text-xs">
            {timingText}
          </Badge>
        )}
      </div>
    );
  };
  
  // Display a placeholder if medication name is empty
  const getMedicationName = (medication: Medication) => {
    if (!medication.name) return "Unnamed Medication";
    return medication.name;
  };
  
  // Get status component
  const getStatusComponent = (medication: Medication) => {
    if (medication.status === 'taken') {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Taken</span>
        </div>
      );
    } else if (medication.status === 'missed') {
      return (
        <div className="flex items-center text-red-600">
          <XCircle className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Missed</span>
        </div>
      );
    } else {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onMarkAsTaken(medication.id)}
          >
            Taken
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => onMarkAsMissed(medication.id)}
          >
            Missed
          </Button>
        </div>
      );
    }
  };

  const handleDelete = async (medicationId: string) => {
    if (!onDelete) return;
    
    try {
      await onDelete(medicationId);
      toast.success("Medication deleted successfully");
    } catch (error) {
      toast.error("Failed to delete medication");
    }
  };

  const handleEditClick = (medication: Medication) => {
    setEditingMedication(medication);
  };

  const handleEditComplete = () => {
    setEditingMedication(null);
  };

  return (
    <>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">#</TableHead>
                        <TableHead>Medication</TableHead>
                        <TableHead className="w-[120px]">Morning</TableHead>
                        <TableHead className="w-[120px]">Afternoon</TableHead>
                        <TableHead className="w-[120px]">Evening</TableHead>
                        <TableHead className="w-[180px]">Instructions</TableHead>
                        <TableHead className="w-[120px] text-right">Status</TableHead>
                        <TableHead className="w-[100px] text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medications
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((med, index) => (
                          <TableRow key={med.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <ListOrdered className="h-4 w-4 text-gray-400 mr-2" />
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-medsnap-blue" />
                                  {getMedicationName(med)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {med.dosage || "No dosage specified"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getTimingDisplay(med, 'morning')}</TableCell>
                            <TableCell>{getTimingDisplay(med, 'afternoon')}</TableCell>
                            <TableCell>{getTimingDisplay(med, 'evening')}</TableCell>
                            <TableCell>
                              {med.instructions ? (
                                <div className="flex items-start">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                  <span className="text-sm">{med.instructions}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No special instructions</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {getStatusComponent(med)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleEditClick(med)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDelete(med.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
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

      {/* Edit medication dialog */}
      <Dialog open={editingMedication !== null} onOpenChange={(open) => !open && setEditingMedication(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          {editingMedication && (
            <EditMedicationForm medication={editingMedication} onComplete={handleEditComplete} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
