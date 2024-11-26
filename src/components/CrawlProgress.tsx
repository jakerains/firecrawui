import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ResultsModal from './ResultsModal';
import { useCrawlStore } from '@/hooks/use-crawl-store';
import { 
  StopIcon, 
  DocumentTextIcon,
  ArrowPathIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface CrawlProgressProps {
  onComplete: () => void;
}

export default function CrawlProgress({ onComplete }: CrawlProgressProps) {
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { 
    progress, 
    pagesCrawled, 
    status, 
    results,
    stopCrawl,
    error 
  } = useCrawlStore();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Crawl Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleViewResults = () => {
    if (results) {
      setShowResults(true);
    } else {
      toast({
        title: 'No Results',
        description: 'No results available to display',
        variant: 'destructive',
      });
    }
  };

  const handleStopCrawl = () => {
    stopCrawl();
    toast({
      title: 'Crawl Stopped',
      description: 'The crawl process has been stopped.',
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="p-6 bg-[#1f2937]/50 backdrop-blur-sm border-[#374151]/50 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">
                  {status === 'complete' ? 'Crawl Complete' : 'Crawling in Progress'}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {pagesCrawled} pages processed
                </p>
              </div>
              
              {status !== 'complete' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowPathIcon className="w-5 h-5 text-blue-400" />
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{progress}% complete</span>
                <span>{status}</span>
              </div>
            </div>

            <div className="flex gap-4">
              {status === 'complete' ? (
                <>
                  <Button 
                    onClick={handleViewResults}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                  <Button 
                    onClick={onComplete}
                    variant="outline"
                    className="flex-1"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Start New Job
                  </Button>
                </>
              ) : (
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={handleStopCrawl}
                >
                  <StopIcon className="w-4 h-4 mr-2" />
                  Stop Crawl
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {results && (
        <ResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          results={results}
          jobType="crawl"
        />
      )}
    </>
  );
}