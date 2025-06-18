
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Eye, EyeOff } from 'lucide-react';
import { getStoredGeminiApiKey, setGeminiApiKey } from '@/services/clientOcrService';

interface GeminiApiKeyInputProps {
  onApiKeySet: (hasKey: boolean) => void;
}

const GeminiApiKeyInput: React.FC<GeminiApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKeyState] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    const storedKey = getStoredGeminiApiKey();
    if (storedKey) {
      setHasStoredKey(true);
      onApiKeySet(true);
    }
  }, [onApiKeySet]);

  const handleSaveKey = () => {
    if (apiKey.trim() && apiKey.startsWith('AIza')) {
      setGeminiApiKey(apiKey.trim());
      setHasStoredKey(true);
      onApiKeySet(true);
      setApiKeyState('');
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setHasStoredKey(false);
    onApiKeySet(false);
  };

  if (hasStoredKey) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <Key className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-green-800">Gemini API key is configured and ready to use</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearKey}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Clear Key
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Key className="h-4 w-4 text-blue-600" />
      <AlertDescription>
        <div className="space-y-3">
          <p className="text-blue-800 mb-2">
            To use the alternative OCR method, please enter your Gemini API key:
          </p>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="gemini-key">Gemini API Key</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="gemini-key"
                  type={showKey ? "text" : "password"}
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                onClick={handleSaveKey}
                disabled={!apiKey.trim() || !apiKey.startsWith('AIza')}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              Get your API key from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GeminiApiKeyInput;
