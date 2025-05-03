
import { useState } from "react";
import { User, Plus, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedications } from "@/hooks/useMedications";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isWithinInterval, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import MedicationSchedule from "@/components/MedicationSchedule";
import AddMedicationForm from "@/components/AddMedicationForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MedicationReminderList from "@/components/MedicationReminderList";

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activePatient, setActivePatient] = useState("self");
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { medications, loading, error, markMedicationStatus, deleteMedication } = useMedications();

  const patients = [
    { id: "self", name: profile?.full_name ? `${profile.full_name} (You)` : "You" }
  ];

  const formattedDate = date ? format(date, "PPP") : "";
  
  const filteredMedications = medications.filter(med => {
    if (!date) return false;
    
    const selectedDate = startOfDay(date);
    
    const startDate = med.startDate ? startOfDay(new Date(med.startDate)) : null;
    const endDate = med.endDate ? startOfDay(new Date(med.endDate)) : null;
    
    if (!startDate) return false;
    
    if (endDate) {
      return isWithinInterval(selectedDate, { start: startDate, end: endDate });
    }
    
    return selectedDate >= startDate;
  });

  const handleMarkAsTaken = async (medicationId: string) => {
    await markMedicationStatus(medicationId, 'taken');
  };

  const handleMarkAsMissed = async (medicationId: string) => {
    await markMedicationStatus(medicationId, 'missed');
  };

  const handleDelete = async (medicationId: string) => {
    await deleteMedication(medicationId);
  };

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
          <Button onClick={() => setDate(new Date())}>
            Today
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Manage your medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              <div className="text-lg font-semibold mb-2">
                {date ? formattedDate : "Select a date"}
              </div>
              {loading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
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
                </>
              )}
            </div>
            
            <div className="mt-6">
              <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full flex items-center gap-2">
                    <Plus size={16} />
                    Add Medication Manually
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                    <DialogDescription>
                      Enter medication details to add it to your schedule
                    </DialogDescription>
                  </DialogHeader>
                  <AddMedicationForm onComplete={() => setIsAddMedicationOpen(false)} />
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/scan")}
              >
                Scan Prescription
              </Button>
            </div>

            <div className="mt-6">
              <MedicationReminderList />
            </div>
          </CardContent>
        </Card>
        
        <MedicationSchedule 
          medications={filteredMedications}
          loading={loading}
          date={date}
          onMarkAsTaken={handleMarkAsTaken}
          onMarkAsMissed={handleMarkAsMissed}
          onDelete={handleDelete}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold text-medsnap-blue">
                  {medications.length > 0 ? 
                    Math.round((medications.filter(m => m.status === 'taken').length / medications.length) * 100) : 0}%
                </div>
                <p className="text-sm text-gray-500">Last 30 days</p>
                <div className="h-2 bg-gray-100 rounded-full mt-4">
                  <div 
                    className="h-2 bg-medsnap-blue rounded-full" 
                    style={{ width: medications.length > 0 ? 
                      `${Math.round((medications.filter(m => m.status === 'taken').length / medications.length) * 100)}%` : '0%' 
                    }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Medications Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{medications.length}</div>
                <p className="text-sm text-gray-500">
                  {activePatient === 'self' ? 'Your' : 'Their'} medications
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View All</Button>
                  <Button size="sm" onClick={() => navigate("/scan")}>Add New</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Refills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">0</div>
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
