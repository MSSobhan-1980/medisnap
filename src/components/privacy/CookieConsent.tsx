
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface CookieSettings {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Essential cookies are always enabled
    functional: true,
    analytics: false,
  });
  
  useEffect(() => {
    // Check if user has already consented
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShow(true);
    } else {
      // Parse saved settings
      try {
        const savedSettings = JSON.parse(cookieConsent);
        setSettings(savedSettings);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
      }
    }
  }, []);
  
  const handleAcceptAll = () => {
    const allSettings = {
      essential: true,
      functional: true,
      analytics: true,
    };
    saveSettings(allSettings);
  };
  
  const handleSaveSettings = () => {
    saveSettings(settings);
  };
  
  const saveSettings = (consentSettings: CookieSettings) => {
    // Save to localStorage
    localStorage.setItem('cookie-consent', JSON.stringify(consentSettings));
    
    // Set cookies based on preferences
    if (consentSettings.analytics) {
      window.LogRocket?.init('nutrisnap/app');
    }
    
    // Hide banner
    setShow(false);
  };
  
  const toggleSetting = (key: keyof CookieSettings) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-start">
          <div className="pr-4">
            <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies.
            </p>
            
            {expanded && (
              <div className="space-y-4 mt-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="essential" 
                    checked={settings.essential} 
                    disabled 
                  />
                  <div>
                    <label htmlFor="essential" className="font-medium text-sm cursor-not-allowed">
                      Essential Cookies
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Required for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="functional" 
                    checked={settings.functional} 
                    onCheckedChange={() => toggleSetting('functional')}
                  />
                  <div>
                    <label htmlFor="functional" className="font-medium text-sm cursor-pointer">
                      Functional Cookies
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Remember your preferences and settings to enhance your experience.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="analytics" 
                    checked={settings.analytics} 
                    onCheckedChange={() => toggleSetting('analytics')}
                  />
                  <div>
                    <label htmlFor="analytics" className="font-medium text-sm cursor-pointer">
                      Analytics Cookies
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Help us understand how visitors interact with our website to improve it.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              For more information, please visit our <Link to="/cookie-policy" className="underline">Cookie Policy</Link>.
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button size="sm" variant="default" onClick={handleAcceptAll}>Accept All</Button>
            {!expanded && (
              <Button size="sm" variant="outline" onClick={() => setExpanded(true)}>Customize</Button>
            )}
            {expanded && (
              <Button size="sm" variant="outline" onClick={handleSaveSettings}>Save Settings</Button>
            )}
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 absolute top-2 right-2" onClick={() => setShow(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
