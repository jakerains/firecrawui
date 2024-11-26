import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FirecrawlApi } from '@/lib/services/api';
import { useHistoryStore } from '@/lib/stores/history-store';
import ResultsModal from '@/components/ResultsModal';
import HistoryButton from '@/components/HistoryButton';
import { 
  BeakerIcon, 
  GlobeAltIcon, 
  CodeBracketIcon,
  ArrowPathIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function ExtractPanel() {
  const [url, setUrl] = useState('');
  const [useSchema, setUseSchema] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [schema, setSchema] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const { toast } = useToast();
  const { addEntry } = useHistoryStore();
  const api = new FirecrawlApi('fc-bcd104e9c38444f5b25cb19922a46ff9');

  const handleExtract = async () => {
    if (!url) {
      toast({
        title: 'URL Required',
        description: 'Please enter a URL to extract data from.',
        variant: 'destructive',
      });
      return;
    }

    if (!prompt && !schema) {
      toast({
        title: 'Input Required',
        description: 'Please provide either a schema or a prompt for extraction.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const options = {
        extract: useSchema 
          ? { schema: JSON.parse(schema) }
          : { prompt },
        formats: ['extract']
      };

      const response = await api.extract(url, options);

      if (!response.success) {
        throw new Error(response.error || 'Extraction failed');
      }

      const formattedResults = {
        markdown: JSON.stringify(response.data.extract, null, 2),
        html: `<pre>${JSON.stringify(response.data.extract, null, 2)}</pre>`,
      };

      setResults(formattedResults);
      setShowResults(true);
      
      addEntry({
        type: 'extract',
        url,
        status: 'success',
        results: formattedResults,
      });

      toast({
        title: 'Extraction Complete',
        description: 'Data has been successfully extracted.',
        action: () => setShowResults(true),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      
      addEntry({
        type: 'extract',
        url,
        status: 'error',
        error: message,
      });

      toast({
        title: 'Extraction Failed',
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
                <BeakerIcon className="mr-3 h-6 w-6 text-amber-400" />
                LLM Data Extraction
              </h2>
              <div className="flex items-center gap-2">
                {results && (
                  <Button
                    onClick={() => setShowResults(true)}
                    variant="outline"
                    className="gap-2 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-300"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Results
                  </Button>
                )}
                <HistoryButton type="extract" />
              </div>
            </div>

            <div className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium text-gray-200">
                  Page URL
                </Label>
                <div className="relative">
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-[#2a3441]/50 border-[#4b5563]/50 focus:border-amber-500/50 focus:ring-amber-500/20 pl-10"
                    placeholder="https://example.com/page"
                  />
                  <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Extraction Method Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/20 border border-gray-700/30">
                <div className="space-y-1">
                  <Label htmlFor="use-schema" className="text-sm">Use Schema</Label>
                  <p className="text-xs text-gray-500">Toggle between schema and free-form prompt</p>
                </div>
                <Switch
                  id="use-schema"
                  checked={useSchema}
                  onCheckedChange={setUseSchema}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>

              {/* Schema or Prompt Input */}
              <div className="space-y-2">
                <Label 
                  htmlFor={useSchema ? "schema" : "prompt"} 
                  className="text-sm font-medium text-gray-200"
                >
                  {useSchema ? "Schema Definition" : "Extraction Prompt"}
                </Label>
                
                {useSchema ? (
                  <div className="relative">
                    <Textarea
                      id="schema"
                      value={schema}
                      onChange={(e) => setSchema(e.target.value)}
                      className="min-h-[200px] font-mono text-sm bg-[#2a3441]/50 border-[#4b5563]/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                      placeholder="Enter JSON schema..."
                    />
                    <CodeBracketIcon className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                ) : (
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[200px] bg-[#2a3441]/50 border-[#4b5563]/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                    placeholder="Extract the product name, price, and key features from this page..."
                  />
                )}
              </div>
            </div>

            <Button 
              onClick={handleExtract}
              disabled={!url || (!prompt && !schema) || isLoading}
              className={`
                w-full transition-all duration-300
                ${isLoading 
                  ? 'bg-amber-500/20 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                }
              `}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Data...
                </>
              ) : (
                <>
                  <BeakerIcon className="w-4 h-4 mr-2" />
                  Extract Data
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
          jobType="extract"
        />
      )}
    </>
  );
}