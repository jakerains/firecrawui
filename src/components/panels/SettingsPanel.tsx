import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DEFAULT_SETTINGS, type Settings } from '@/lib/constants';
import { 
  Cog6ToothIcon,
  KeyIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('firecrawl-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setApiKey(parsed.apiKey || '');
      setIsApiKeySaved(!!parsed.apiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    const newSettings = { ...settings, apiKey };
    localStorage.setItem('firecrawl-settings', JSON.stringify(newSettings));
    setSettings(newSettings);
    setIsApiKeySaved(true);
    toast({
      title: 'API Key saved',
      description: 'Your API key has been saved successfully.',
    });
  };

  const handleSave = () => {
    localStorage.setItem('firecrawl-settings', JSON.stringify(settings));
    toast({
      title: 'Settings saved',
      description: 'Your settings have been saved successfully.',
    });
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setApiKey('');
    setIsApiKeySaved(false);
    localStorage.removeItem('firecrawl-settings');
    toast({
      title: 'Settings reset',
      description: 'All settings have been reset to defaults.',
    });
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-[#1f2937]/50 backdrop-blur-sm border-[#374151]/50 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="relative space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-100 flex items-center">
                <Cog6ToothIcon className="mr-3 h-6 w-6 text-slate-400" />
                Global Settings
              </h2>

              <div className="space-y-6">
                {/* API Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-200 flex items-center">
                    <KeyIcon className="w-4 h-4 mr-2 text-slate-400" />
                    API Configuration
                  </h3>
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="api-key" className="text-sm">API Key</Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your Firecrawl API key from the dashboard</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          id="api-key"
                          type="password"
                          value={apiKey}
                          onChange={(e) => {
                            setApiKey(e.target.value);
                            setIsApiKeySaved(false);
                          }}
                          className={`
                            bg-[#2a3441]/50 border-[#4b5563]/50 
                            focus:border-slate-500/50 focus:ring-slate-500/20 pr-10
                            ${isApiKeySaved ? 'border-green-500/30' : ''}
                          `}
                          placeholder="Enter your Firecrawl API key"
                        />
                        {isApiKeySaved && (
                          <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <Button
                        onClick={handleSaveApiKey}
                        disabled={!apiKey || isApiKeySaved}
                        className={`
                          px-4 transition-all duration-300
                          ${isApiKeySaved 
                            ? 'bg-green-500/20 text-green-300 cursor-not-allowed' 
                            : 'bg-slate-500 hover:bg-slate-600 shadow-lg shadow-slate-500/20'
                          }
                        `}
                      >
                        {isApiKeySaved ? 'Saved' : 'Save Key'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Output Preferences */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-200 flex items-center">
                    <DocumentTextIcon className="w-4 h-4 mr-2 text-slate-400" />
                    Output Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/20 border border-gray-700/30">
                      <div className="space-y-1">
                        <Label htmlFor="include-metadata" className="text-sm">Include Metadata</Label>
                        <p className="text-xs text-gray-500">Add page metadata to output</p>
                      </div>
                      <Switch
                        id="include-metadata"
                        checked={settings.outputPreferences.includeMetadata}
                        onCheckedChange={(value) => 
                          setSettings(prev => ({
                            ...prev,
                            outputPreferences: {
                              ...prev.outputPreferences,
                              includeMetadata: value
                            }
                          }))
                        }
                        className="data-[state=checked]:bg-slate-600"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/20 border border-gray-700/30">
                      <div className="space-y-1">
                        <Label htmlFor="prettify" className="text-sm">Prettify Output</Label>
                        <p className="text-xs text-gray-500">Format output for readability</p>
                      </div>
                      <Switch
                        id="prettify"
                        checked={settings.outputPreferences.prettify}
                        onCheckedChange={(value) => 
                          setSettings(prev => ({
                            ...prev,
                            outputPreferences: {
                              ...prev.outputPreferences,
                              prettify: value
                            }
                          }))
                        }
                        className="data-[state=checked]:bg-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Rate Limiting */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-200 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2 text-slate-400" />
                    Rate Limiting
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/20 border border-gray-700/30">
                      <div className="space-y-1">
                        <Label htmlFor="rate-limit" className="text-sm">Enable Rate Limiting</Label>
                        <p className="text-xs text-gray-500">Prevent API throttling</p>
                      </div>
                      <Switch
                        id="rate-limit"
                        checked={settings.rateLimit.enabled}
                        onCheckedChange={(value) => 
                          setSettings(prev => ({
                            ...prev,
                            rateLimit: {
                              ...prev.rateLimit,
                              enabled: value
                            }
                          }))
                        }
                        className="data-[state=checked]:bg-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Retry Options */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-200 flex items-center">
                    <ArrowPathIcon className="w-4 h-4 mr-2 text-slate-400" />
                    Retry Options
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/20 border border-gray-700/30">
                      <div className="space-y-1">
                        <Label className="text-sm">Max Retries</Label>
                        <p className="text-xs text-gray-500">Number of retry attempts</p>
                      </div>
                      <Select
                        value={settings.retryOptions.maxRetries.toString()}
                        onValueChange={(value) => 
                          setSettings(prev => ({
                            ...prev,
                            retryOptions: {
                              ...prev.retryOptions,
                              maxRetries: parseInt(value)
                            }
                          }))
                        }
                      >
                        <SelectTrigger className="w-24 bg-[#2a3441]/50 border-[#4b5563]/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} {n === 1 ? 'retry' : 'retries'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleSave}
                className="flex-1 bg-slate-500 hover:bg-slate-600 shadow-lg shadow-slate-500/20"
              >
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                Save All Settings
              </Button>
              
              <Button 
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-slate-500/20 hover:bg-slate-500/10"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}