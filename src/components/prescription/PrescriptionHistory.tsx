
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileImage, Trash2, Calendar, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  getPrescriptionScans,
  deletePrescriptionScan,
  PrescriptionScan
} from '@/services/prescriptionScanService';

export function PrescriptionHistory() {
  const { user } = useAuth();
  const [scans, setScans] = useState<PrescriptionScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchScans();
    }
  }, [user]);

  const fetchScans = async () => {
    if (!user) return;
    
    try {
      const data = await getPrescriptionScans(user.id);
      setScans(data);
    } catch (error: any) {
      console.error('Error fetching prescription scans:', error);
      toast.error('Failed to load prescription history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    try {
      await deletePrescriptionScan(scanId);
      setScans(prev => prev.filter(scan => scan.id !== scanId));
      toast.success('Prescription scan deleted');
    } catch (error: any) {
      console.error('Error deleting scan:', error);
      toast.error('Failed to delete prescription scan');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading prescription history...</span>
        </CardContent>
      </Card>
    );
  }

  if (scans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prescription History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No prescription scans yet</p>
            <p className="text-sm text-gray-500">Upload a prescription to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scans.map((scan) => (
            <div key={scan.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileImage className="h-6 w-6 text-blue-500 mt-1" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(scan.processing_status)}
                      <Badge className={getStatusColor(scan.processing_status)}>
                        {scan.processing_status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(scan.scan_date).toLocaleDateString()}
                    </div>
                    {scan.extracted_medications && scan.extracted_medications.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Found {scan.extracted_medications.length} medication(s)
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {scan.image_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(scan.image_url, '_blank')}
                    >
                      View Image
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteScan(scan.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {scan.extracted_medications && scan.extracted_medications.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <h5 className="text-sm font-medium mb-2">Extracted Medications:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {scan.extracted_medications.map((med: any, index: number) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                        <p className="font-medium">{med.medication_name}</p>
                        {med.dosage && <p className="text-gray-600">{med.dosage}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
