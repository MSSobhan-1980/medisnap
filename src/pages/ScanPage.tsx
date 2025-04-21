
import { useState } from "react";
import { Upload, Camera, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState("scan");
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    if (!image) return;
    
    setScanning(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setScanning(false);
      // Navigate to form with pre-filled data in real app
      setActiveTab("manual");
    }, 2000);
  };

  const clearImage = () => {
    setImage(null);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Add Medication</h1>
      <p className="text-gray-500 mb-8">
        Scan your prescription or add medication details manually
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="scan">
            <Camera className="mr-2 h-4 w-4" /> Scan Medication
          </TabsTrigger>
          <TabsTrigger value="manual">
            <PlusCircle className="mr-2 h-4 w-4" /> Manual Entry
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
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={handleScan}
                      disabled={scanning}
                      className="bg-medsnap-blue hover:bg-blue-600"
                    >
                      {scanning ? "Processing..." : "Process Image"}
                    </Button>
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
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="medication-name">Medication Name *</Label>
                    <Input 
                      id="medication-name" 
                      placeholder="e.g., Lisinopril, Metformin" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage *</Label>
                    <Input 
                      id="dosage" 
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
                      defaultValue=""
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
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input 
                      id="start-date" 
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date (Optional)</Label>
                    <Input 
                      id="end-date" 
                      type="date" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <textarea 
                    id="instructions" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g., Take with food, Avoid dairy products"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <select 
                    id="patient"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="self"
                  >
                    <option value="self">Jane Smith (You)</option>
                    <option value="parent">Robert Smith (Parent)</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-medsnap-blue hover:bg-blue-600">
                    Add Medication
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
