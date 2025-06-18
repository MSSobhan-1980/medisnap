
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  uploadPrescriptionImage,
  createPrescriptionScan,
  processPrescriptionWithOCR,
  convertScanToMedications
} from '@/services/prescriptionScanService';
import { addMultipleMedications } from '@/services/medicationService';

interface PrescriptionScannerProps {
  onMedicationsAdded?: () => void;
}

export function PrescriptionScanner({ onMedicationsAdded }: PrescriptionScannerProps) {
  const { user, activeMember } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setScanResult(null);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleScanPrescription = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setProgress(10);

    try {
      // Upload image
      toast.info('Uploading prescription image...');
      const imageUrl = await uploadPrescriptionImage(selectedFile, user.id);
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      setProgress(30);
      
      // Create scan record
      const scan = await createPrescriptionScan(user.id, imageUrl);
      setProgress(50);
      
      setUploading(false);
      setProcessing(true);
      
      toast.info('Processing prescription with AI...');
      
      // Process with OCR
      const result = await processPrescriptionWithOCR(scan.id, imageUrl, user.id);
      setProgress(90);
      
      if (result.success) {
        setScanResult(result);
        setProgress(100);
        toast.success('Prescription processed successfully!');
      } else {
        throw new Error(result.error || 'Failed to process prescription');
      }
      
    } catch (error: any) {
      console.error('Error processing prescription:', error);
      toast.error('Failed to process prescription', {
        description: error.message
      });
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleAddMedications = async () => {
    if (!scanResult || !user) return;

    try {
      const medications = convertScanToMedications({
        extracted_medications: scanResult.extractedMedications
      } as any);

      if (medications.length === 0) {
        toast.error('No medications found to add');
        return;
      }

      await addMultipleMedications(user.id, medications, activeMember?.id);
      
      toast.success(`Added ${medications.length} medication(s) to your list`);
      setScanResult(null);
      setSelectedFile(null);
      setProgress(0);
      
      if (onMedicationsAdded) {
        onMedicationsAdded();
      }
      
    } catch (error: any) {
      console.error('Error adding medications:', error);
      toast.error('Failed to add medications', {
        description: error.message
      });
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setScanResult(null);
    setProgress(0);
    setUploading(false);
    setProcessing(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Prescription Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Select a prescription image to scan and extract medications
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="max-w-xs mx-auto"
            />
          </div>
        )}

        {selectedFile && !scanResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FileImage className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {(uploading || processing) && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-gray-600">
                  {uploading && 'Uploading image...'}
                  {processing && 'Processing with AI...'}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleScanPrescription}
                disabled={uploading || processing}
                className="flex-1"
              >
                {uploading || processing ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileImage className="h-4 w-4 mr-2" />
                )}
                Scan Prescription
              </Button>
              <Button variant="outline" onClick={resetScanner}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {scanResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Scan completed successfully!</span>
            </div>

            {scanResult.extractedMedications && scanResult.extractedMedications.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Found medications:</h4>
                <div className="space-y-2">
                  {scanResult.extractedMedications.map((med: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{med.medication_name}</p>
                      {med.dosage && <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>}
                      {med.dosing_pattern && <p className="text-sm text-gray-600">Pattern: {med.dosing_pattern}</p>}
                      {med.instructions && <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleAddMedications} className="flex-1">
                Add to Medication List
              </Button>
              <Button variant="outline" onClick={resetScanner}>
                Scan Another
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
