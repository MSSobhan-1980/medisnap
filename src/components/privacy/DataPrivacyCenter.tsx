
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Download, Trash2, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DataPrivacyCenter() {
  const { user, signOut } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const handleExportData = async () => {
    if (!user) return;
    
    try {
      setExporting(true);
      toast.info("Preparing your data export", { duration: 5000 });
      
      // Collect user data from various tables using a safer approach with error handling
      const userData: Record<string, any> = {
        profile: null,
        meals: [],
        reminders: [],
        medications: [],
      };
      
      // Fetch profile data
      try {
        const profileResult = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        
        if (profileResult.data && profileResult.data.length > 0) {
          userData.profile = profileResult.data[0];
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
      
      // Fetch meal detection data if table exists
      try {
        // First try RPC function
        try {
          const mealResult = await supabase.rpc('get_user_meal_detections', { 
            user_uuid: user.id 
          }) as any;
          
          if (!mealResult.error && mealResult.data) {
            userData.meals = mealResult.data;
          } else {
            throw new Error('RPC method failed');
          }
        } catch (error) {
          console.log('Fallback to direct query for meal_detections');
          // Fallback method if RPC doesn't exist - using type assertion
          const directResult = await (supabase
            .from('meal_detections' as any)
            .select('*')
            .eq('user_id', user.id)) as any;
            
          if (directResult?.data) {
            userData.meals = directResult.data;
          }
        }
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
      
      // Fetch medication reminders
      try {
        const reminderResult = await supabase
          .from('medication_reminders')
          .select('*')
          .eq('user_id', user.id);
        
        if (reminderResult.data) {
          userData.reminders = reminderResult.data;
        }
      } catch (error) {
        console.error("Error fetching reminder data:", error);
      }
      
      // Fetch medications
      try {
        const medicationResult = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id);
        
        if (medicationResult.data) {
          userData.medications = medicationResult.data;
        }
      } catch (error) {
        console.error("Error fetching medication data:", error);
      }
      
      // Convert to JSON and create blob
      const dataStr = JSON.stringify(userData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `nutrisnap-data-export-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Data export complete");
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      toast.loading("Deleting your account and data...");
      
      // Delete meal detections using RPC if available
      try {
        await (supabase.rpc('delete_user_meal_detections', { 
          user_uuid: user.id 
        }) as any);
      } catch (error) {
        console.error("RPC delete_user_meal_detections failed:", error);
        // Fallback if RPC doesn't exist
        try {
          await (supabase
            .from('meal_detections' as any)
            .delete()
            .eq('user_id', user.id) as any);
        } catch (innerError) {
          console.error("Could not delete meal_detections:", innerError);
        }
      }
      
      // Delete from standard tables
      const tables = ['medications', 'medication_reminders', 'profiles'];
      
      for (const table of tables) {
        try {
          await supabase.from(table as any).delete().eq('user_id', user.id);
        } catch (error) {
          console.error(`Error deleting from ${table}:`, error);
        }
      }
      
      // Sign out user
      await signOut();
      
      toast.dismiss();
      toast.success("Account deleted successfully");
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account");
    }
  };
  
  return (
    <>
      <Card className="max-w-lg mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Privacy Center
          </CardTitle>
          <CardDescription>
            Manage your data and privacy preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Your Data Controls</h3>
            <p className="text-sm text-gray-500 mb-4">
              You have the right to access, export, or delete your personal data.
            </p>
            
            <div className="grid gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleExportData}
                disabled={exporting}
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Preparing Export...' : 'Export My Data'}
              </Button>
              
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete My Account & Data
              </Button>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Information</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Deleting your account will permanently remove all your data including nutrition records, 
                  medication reminders, and profile information. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start space-y-2 text-sm text-gray-500">
          <p>For questions about your data, contact us at: privacy@nutrisnap.app</p>
          <div className="flex gap-2">
            <a href="/privacy-policy" className="underline">Privacy Policy</a>
            <span>•</span>
            <a href="/terms-of-service" className="underline">Terms of Service</a>
          </div>
        </CardFooter>
      </Card>
      
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone and your data cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
