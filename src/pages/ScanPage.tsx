
import { toast } from "sonner";
import { useState } from "react";
import { Upload, Camera, X, PlusCircle, Images, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import MedicationImageUpload from "@/components/MedicationImageUpload";
import MedicationImageGallery from "@/components/MedicationImageGallery";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { addMedication, processAIMedicationData } from "@/services/medicationService";
import { MedicationFormData } from "@/types/medication";
import { useNavigate } from "react-router-dom";

async function callEdgeFn(path: string, body: Record<string, any>) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || '';
  
  const url = `https://mfnedcdjckwcvqjoaevh.functions.supabase.co/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  
  const responseData = await res.json();
  
  if (!res.ok) {
    console.error("API Error:", res.status, responseData);
    throw new Error(responseData.error || `API error: ${res.status}`);
  }
  
  return responseData;
}

export default function ScanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("scan");
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [addingMedication, setAddingMedication] = useState(false);
  const [medicationAdded, setMedicationAdded] = useState(false);

  const [manualForm, setManualForm] = useState<MedicationFormData>({
    name: "",
    dosage: "",
    frequency: "once-daily",
    time: "08:00",
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setImage(reader.result as string);
        setError(null); // Clear any previous errors
        setMedicationAdded(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setOcrResult(null);
    setAiResult(null);
    setError(null);
    setMedicationAdded(false);
  };

  function getBase64Content(dataUrl: string) {
    return dataUrl.substring(dataUrl.indexOf(",") + 1);
  }

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
      setAddingMedication(true);
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
    } finally {
      setAddingMedication(false);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setScanning(true);
    setOcrResult(null);
    setAiResult(null);
    setError(null);
    setMedicationAdded(false);

    try {
      toast("Extracting text with OCR...");
      const imageBase64 = getBase64Content(image);
      
      // Call the real OCR edge function
      const ocrData = await callEdgeFn("prescription-ocr", { imageBase64 });
      setOcrResult(ocrData.text);
      toast.success("Text extracted!");

      toast("Analyzing with AI...");
      // Call the real AI analysis edge function
      const aiData = await callEdgeFn("openai-suggest", { text: ocrData.text });
      setAiResult(aiData.result);
      toast.success("Medication info extracted!");
    } catch (err: any) {
      console.error("Error scanning:", err);
      setError(err?.message || "Failed to extract prescription info.");
      toast.error(err?.message || "Failed to extract prescription info.");
    } finally {
      setScanning(false);
    }
  };

  const handleAddMedication = async () => {
    if (!user || !aiResult) return;
    
    try {
      setAddingMedication(true);
      const medicationData = await processAIMedicationData(aiResult);
      await addMedication(user.id, medicationData);
      toast.success("Medication added to your dashboard!");
      setMedicationAdded(true);
    } catch (err: any) {
      toast.error("Failed to add medication", { description: err.message });
    } finally {
      setAddingMedication(false);
    }
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
            <Camera className="mr-2 h-4 w-4" /> Scan Medication
          </TabsTrigger>
          <TabsTrigger value="manual">
            <PlusCircle className="mr-2 h-4 w-4" /> Manual Entry
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <Images className="mr-2 h-4 w-4" /> My Images
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <Card>
            <CardHeader>
              <CardTitle>Scan Medication</CardTitle>
              <CardDescription>
                Upload an image of your prescription, pill bottle, or blister pack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicationImageUpload />
              {!image ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50">
                  <div className="mb-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Drag and drop your image here or click to upload</p>
                    <p className="text-gray-400 text-sm mb-4">
                      Supported formats: JPG, PNG, HEIC
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Choose File
                      </Button>
                      <Button
                        variant="outline"
                      >
                        <Camera className="mr-2 h-4 w-4" /> Take Photo
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Uploaded medication" 
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-200" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="absolute top-2 right-2 bg-white"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="mt-4 flex flex-col gap-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button
                      onClick={handleScan}
                      disabled={scanning}
                      className="bg-medsnap-blue hover:bg-blue-600"
                    >
                      {scanning ? "Processing..." : "Process Image"}
                    </Button>
                    
                    {ocrResult && (
                      <div className="p-2 rounded border bg-gray-50 text-xs text-gray-600">
                        <div className="font-semibold mb-1">Extracted Text:</div>
                        <pre className="whitespace-pre-wrap">{ocrResult}</pre>
                      </div>
                    )}
                    
                    {aiResult && (
                      <div className="p-3 rounded border bg-blue-50 border-blue-200 mt-2">
                        <div className="font-semibold mb-1">AI Medication Info:</div>
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(aiResult, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {aiResult && !medicationAdded && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleAddMedication}
                        disabled={addingMedication}
                      >
                        {addingMedication ? "Adding..." : "Add to My Medications"}
                      </Button>
                    )}
                    
                    {medicationAdded && (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription className="flex flex-col gap-2">
                          <span>Medication added to your dashboard</span>
                          <Button 
                            variant="outline" 
                            className="mt-2 border-green-600 text-green-600"
                            onClick={() => navigate("/dashboard")}
                          >
                            View in Dashboard
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 bg-medsnap-blue/10 p-4 rounded-lg border border-medsnap-blue/20">
                <h3 className="font-medium text-gray-800 mb-2">How it works</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-medsnap-blue mr-2">1.</span>
                    Upload a clear image of your medication label
                  </li>
                  <li className="flex items-start">
                    <span className="text-medsnap-blue mr-2">2.</span>
                    Our AI extracts medication details automatically
                  </li>
                  <li className="flex items-start">
                    <span className="text-medsnap-blue mr-2">3.</span>
                    Review and confirm the information
                  </li>
                  <li className="flex items-start">
                    <span className="text-medsnap-blue mr-2">4.</span>
                    Your medication is added to your scheduler
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
                    disabled={addingMedication}
                  >
                    {addingMedication ? "Adding..." : "Add Medication"}
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
