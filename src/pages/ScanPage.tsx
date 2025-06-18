
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Upload, Camera, X, PlusCircle, Images, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import MedicationImageUpload from "@/components/MedicationImageUpload";
import MedicationImageGallery from "@/components/MedicationImageGallery";
import { PrescriptionScanner } from "@/components/prescription/PrescriptionScanner";
import { useAuth } from "@/hooks/useAuth";
import { addMedication, addMultipleMedications, processAIMedicationData } from "@/services/medicationService";
import { MedicationFormData, OcrMedicationData } from "@/types/medication";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("scan");

  const [manualForm, setManualForm] = useState<MedicationFormData>({
    name: "",
    dosage: "",
    frequency: "once-daily",
    time: "08:00",
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleManualFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setManualForm(prev => ({ ...prev, [id]: value }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add medications");
      return;
    }

    try {
      await addMedication(user.id, manualForm);
      toast.success("Medication added successfully!");
      
      // Reset form
      setManualForm({
        name: "",
        dosage: "",
        frequency: "once-daily",
        time: "08:00",
        startDate: new Date().toISOString().split('T')[0]
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Failed to add medication", { description: err.message });
    }
  };

  const handleMedicationsAdded = () => {
    // Refresh or navigate as needed
    navigate("/dashboard");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Add Medication</h1>
      <p className="text-gray-500 mb-8">
        Scan your prescription or add medication details manually
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="scan">
            <Camera className="mr-2 h-4 w-4" /> Scan Prescription
          </TabsTrigger>
          <TabsTrigger value="manual">
            <PlusCircle className="mr-2 h-4 w-4" /> Manual Entry
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <Images className="mr-2 h-4 w-4" /> My Images
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <PrescriptionScanner onMedicationsAdded={handleMedicationsAdded} />
        </TabsContent>
        
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>
                Enter medication details manually to add to your schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleManualSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medication Name *</Label>
                    <Input 
                      id="name" 
                      value={manualForm.name}
                      onChange={handleManualFormChange}
                      placeholder="e.g., Lisinopril, Metformin" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage *</Label>
                    <Input 
                      id="dosage" 
                      value={manualForm.dosage}
                      onChange={handleManualFormChange}
                      placeholder="e.g., 10mg, 500mg, 5ml" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <select 
                      id="frequency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={manualForm.frequency}
                      onChange={handleManualFormChange}
                      required
                    >
                      <option value="" disabled>Select frequency</option>
                      <option value="once-daily">Once daily</option>
                      <option value="twice-daily">Twice daily</option>
                      <option value="three-times-daily">Three times daily</option>
                      <option value="four-times-daily">Four times daily</option>
                      <option value="as-needed">As needed</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time of First Dose *</Label>
                    <Input 
                      id="time" 
                      type="time"
                      value={manualForm.time}
                      onChange={handleManualFormChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={manualForm.startDate}
                      onChange={handleManualFormChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={manualForm.endDate || ""}
                      onChange={handleManualFormChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <textarea 
                    id="instructions" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g., Take with food, Avoid dairy products"
                    value={manualForm.instructions || ""}
                    onChange={handleManualFormChange}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-medsnap-blue hover:bg-blue-600"
                  >
                    Add Medication
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>My Medication Images</CardTitle>
              <CardDescription>
                View and manage your uploaded medication images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicationImageGallery />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
