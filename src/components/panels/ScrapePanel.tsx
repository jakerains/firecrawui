import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FirecrawlApi } from '@/lib/services/api';
import { useHistoryStore } from '@/lib/stores/history-store';
import ResultsModal from '@/components/ResultsModal';
import HistoryButton from '@/components/HistoryButton';
import { 
  CommandLineIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  CodeBracketIcon,
  EyeIcon,
  GlobeAltIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const OUTPUT_FORMATS = [
  {
    value: 'markdown',
    label: 'Markdown',
    icon: DocumentTextIcon,
    description: 'Clean, formatted text',
  },
  {
    value: 'html',
    label: 'HTML',
    icon: CodeBracketIcon,
    description: 'Processed HTML content',
  },
  {
    value: 'rawHtml',
    label: 'Raw HTML',
    icon: CodeBracketIcon,
    description: 'Unmodified HTML content',
  },
  {
    value: 'screenshot',
    label: 'Screenshot',
    icon: PhotoIcon,
    description: 'Page screenshot (PNG)',
  },
];

export default function ScrapePanel() {
  const [url, setUrl] = useState('');
  const [formats, setFormats] = useState<string[]>(['markdown']);
  const [mainContentOnly, setMainContentOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const { toast } = useToast();
  const { addEntry } = useHistoryStore();
  const api = new FirecrawlApi('fc-bcd104e9c38444f5b25cb19922a46ff9');

  const handleScrape = async () => {
    if (!url) {
      toast({
        title: 'URL Required',
        description: 'Please enter a URL to scrape.',
        variant: 'destructive',
      });
      return;
    }

    if (formats.length === 0) {
      toast({
        title: 'Format Required',
        description: 'Please select at least one output format.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.scrape(url, {
        formats,
        onlyMainContent: mainContentOnly,
      });

      if (!response.success) {
        throw new Error(response.error || 'Scraping failed');
      }

      setResults(response.data);
      setShowResults(true);
      
      addEntry({
        type: 'scrape',
        url,
        status: 'success',
        results: response.data,
      });

      toast({
        title: 'Scraping Complete',
        description: 'Page has been successfully scraped.',
        action: () => setShowResults(true),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      
      addEntry({
        type: 'scrape',
        url,
        status: 'error',
        error: message,
      });

      toast({
        title: 'Scraping Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-[#1f2937]/50 backdrop-blur-sm border-[#374151]/50 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                <CommandLineIcon className="mr-3 h-6 w-6 text-purple-400" />
                Single Page Scraper
              </h2>
              <div className="flex items-center gap-2">
                {results && (
                  <Button
                    onClick={() => setShowResults(true)}
                    variant="outline"
                    className="gap-2 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-300"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Results
                  </Button>
                )}
                <HistoryButton type="scrape" />
              </div>
            </div>

            <div className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium text-gray-200">Page URL</Label>
                <div className="relative">
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-[#2a3441]/50 border-[#4b5563]/50 focus:border-purple-500/50 focus:ring-purple-500/20 pl-10"
                    placeholder="https://example.com/page"
                  />
                  <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Output Format Selection */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-200">Output Formats</Label>
                <div className="grid grid-cols-2 gap-4">
                  {OUTPUT_FORMATS.map(({ value, label, icon: Icon, description }) => (
                    <div
                      key={value}
                      className={`
                        relative p-4 rounded-lg cursor-pointer transition-all duration-200
                        ${formats.includes(value) 
                          ? 'bg-purple-500/20 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                          : 'bg-gray-800/20 border-gray-700/30'
                        }
                        border hover:border-purple-500/30 hover:bg-purple-500/10
                      `}
                      onClick={() => {
                        setFormats(prev => 
                          prev.includes(value)
                            ? prev.filter(f => f !== value)
                            : [...prev, value]
                        );
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-5 w-5 ${formats.includes(value) ? 'text-purple-400' : 'text-gray-400'}`} />
                        <div>
                          <h3 className={`text-sm font-medium ${formats.includes(value) ? 'text-purple-300' : 'text-gray-300'}`}>
                            {label}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-200">Advanced Options</h3>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/20 border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="main-content" className="text-sm">Main Content Only</Label>
                    <p className="text-xs text-gray-500">Remove navigation, footers, and sidebars</p>
                  </div>
                  <Switch
                    id="main-content"
                    checked={mainContentOnly}
                    onCheckedChange={setMainContentOnly}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleScrape}
              disabled={!url || formats.length === 0 || isLoading}
              className={`
                w-full transition-all duration-300
                ${isLoading 
                  ? 'bg-purple-500/20 cursor-not-allowed' 
                  : 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/20'
                }
              `}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <CommandLineIcon className="w-4 h-4 mr-2" />
                  Start Scrape
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {results && (
        <ResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          results={results}
          jobType="scrape"
        />
      )}
    </>
  );
}