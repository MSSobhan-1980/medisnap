
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ConsentPromptProps {
  title: string;
  description: string;
  featureId: string;
  requiredConsents: {
    id: string;
    label: string;
  }[];
  onConsent: () => void;
  onDecline: () => void;
}

export default function ConsentPrompt({
  title,
  description,
  featureId,
  requiredConsents,
  onConsent,
  onDecline
}: ConsentPromptProps) {
  const { user } = useAuth();
  const [consents, setConsents] = useState<Record<string, boolean>>(
    Object.fromEntries(requiredConsents.map(c => [c.id, false]))
  );
  const [loading, setLoading] = useState(false);
  
  const handleCheckboxChange = (id: string) => {
    setConsents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const allConsentsGranted = () => {
    return Object.values(consents).every(value => value === true);
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Save consent records to database using raw SQL query since the types aren't updated
      const consentRecords = Object.entries(consents).map(([consentId, granted]) => ({
        user_id: user.id,
        feature_id: featureId,
        consent_id: consentId,
        granted,
        granted_at: new Date().toISOString()
      }));
      
      // First try using RPC function
      try {
        // Use a more aggressive type cast to bypass TypeScript's strict checking
        const { error } = await (supabase.rpc('insert_user_consents', { 
          consent_data: JSON.stringify(consentRecords) 
        }) as unknown as {error: any});
        
        if (error) throw error;
      } catch (error) {
        console.error('Error saving consent using RPC:', error);
        
        // Fallback to direct insert with type assertion
        try {
          // Use a more aggressive type cast for the table access and the insert method
          const { error: insertError } = await (supabase
            .from('user_consents' as any)
            .insert(consentRecords as any) as unknown as {error: any});
            
          if (insertError) throw insertError;
        } catch (innerError) {
          console.error('Error with fallback insert:', innerError);
          throw new Error('Failed to save consent');
        }
      }
      
      toast.success('Consent preferences saved');
      onConsent();
    } catch (error) {
      console.error('Error saving consent:', error);
      toast.error('Failed to save consent preferences');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requiredConsents.map((consent) => (
            <div key={consent.id} className="flex items-start space-x-2">
              <Checkbox 
                id={consent.id}
                checked={consents[consent.id]}
                onCheckedChange={() => handleCheckboxChange(consent.id)}
              />
              <label 
                htmlFor={consent.id} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {consent.label}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onDecline}
          disabled={loading}
        >
          Decline
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!allConsentsGranted() || loading}
        >
          {loading ? 'Saving...' : 'I Consent'}
        </Button>
      </CardFooter>
    </Card>
  );
}
