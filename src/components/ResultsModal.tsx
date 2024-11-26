import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { StorageService } from '@/lib/services/storage';
import { 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  CodeBracketIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  TableCellsIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';

const OUTPUT_FORMATS = [
  {
    value: 'markdown',
    label: 'Markdown',
    icon: DocumentTextIcon,
    extension: 'md',
    description: 'Clean, formatted text',
  },
  {
    value: 'json',
    label: 'JSON',
    icon: CodeBracketIcon,
    extension: 'json',
    description: 'Structured data format',
  },
  {
    value: 'csv',
    label: 'CSV',
    icon: TableCellsIcon,
    extension: 'csv',
    description: 'Spreadsheet compatible',
  },
  {
    value: 'txt',
    label: 'Plain Text',
    icon: DocumentDuplicateIcon,
    extension: 'txt',
    description: 'Simple text format',
  }
];

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    markdown?: string;
    html?: string;
    rawHtml?: string;
    screenshot?: string;
    links?: string[];
  };
  jobType: 'crawl' | 'scrape' | 'extract' | 'map';
}

export default function ResultsModal({ isOpen, onClose, results, jobType }: ResultsModalProps) {
  const [activeTab, setActiveTab] = useState<string>(Object.keys(results)[0] || 'markdown');
  const { toast } = useToast();
  const storage = new StorageService();

  const handleCopyToClipboard = async () => {
    try {
      const content = results[activeTab as keyof typeof results];
      if (!content) return;

      let textToCopy = '';
      if (typeof content === 'string') {
        textToCopy = content;
      } else if (Array.isArray(content)) {
        textToCopy = content.join('\n');
      } else {
        textToCopy = JSON.stringify(content, null, 2);
      }

      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copied to Clipboard',
        description: 'Content has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy content to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (format: string) => {
    try {
      const content = results[activeTab as keyof typeof results];
      if (!content) return;

      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
      const filename = `firecrawl-${jobType}-${activeTab}-${timestamp}`;

      await storage.saveFile(content, {
        filename,
        format: format as any,
        timestamp: true,
      });

      toast({
        title: 'Download Complete',
        description: `Successfully downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download the content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadAll = async () => {
    try {
      await storage.saveMultiFormat(results, OUTPUT_FORMATS.map(f => f.value), {
        filename: `firecrawl-${jobType}-all`,
        timestamp: true,
      });

      toast({
        title: 'Download Complete',
        description: 'Successfully downloaded all formats',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download results. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-[#1f2937]/95 border-[#374151] backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-100">
            {jobType.charAt(0).toUpperCase() + jobType.slice(1)} Results
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-5 bg-[#374151]/50">
              {results.markdown && (
                <TabsTrigger value="markdown" className="flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  Markdown
                </TabsTrigger>
              )}
              {results.html && (
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <CodeBracketIcon className="w-4 h-4" />
                  HTML
                </TabsTrigger>
              )}
              {results.rawHtml && (
                <TabsTrigger value="rawHtml" className="flex items-center gap-2">
                  <CodeBracketIcon className="w-4 h-4" />
                  Raw HTML
                </TabsTrigger>
              )}
              {results.screenshot && (
                <TabsTrigger value="screenshot" className="flex items-center gap-2">
                  <PhotoIcon className="w-4 h-4" />
                  Screenshot
                </TabsTrigger>
              )}
              {results.links && (
                <TabsTrigger value="links" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Links
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex-1 mt-4">
              <ScrollArea className="h-[calc(80vh-16rem)] rounded-md border border-[#374151] bg-[#1f2937]/50">
                {results.markdown && (
                  <TabsContent value="markdown" className="p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {results.markdown}
                    </pre>
                  </TabsContent>
                )}
                {results.html && (
                  <TabsContent value="html" className="p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {results.html}
                    </pre>
                  </TabsContent>
                )}
                {results.rawHtml && (
                  <TabsContent value="rawHtml" className="p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {results.rawHtml}
                    </pre>
                  </TabsContent>
                )}
                {results.screenshot && (
                  <TabsContent value="screenshot" className="p-4">
                    <img 
                      src={results.screenshot} 
                      alt="Page screenshot" 
                      className="max-w-full rounded-lg border border-[#374151]"
                    />
                  </TabsContent>
                )}
                {results.links && (
                  <TabsContent value="links" className="p-4">
                    <ul className="space-y-2">
                      {results.links.map((link, index) => (
                        <li 
                          key={index}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                )}
              </ScrollArea>
            </div>
          </Tabs>

          <div className="border-t border-[#374151] pt-4 space-y-4">
            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                className="flex-1 border-[#374151] hover:bg-[#374151]"
              >
                <ClipboardIcon className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button
                onClick={handleDownloadAll}
                variant="outline"
                className="flex-1 border-[#374151] hover:bg-[#374151]"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download All Formats
              </Button>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-4 gap-4">
              {OUTPUT_FORMATS.map(({ value, label, icon: Icon, description }) => (
                <Button
                  key={value}
                  onClick={() => handleDownload(value)}
                  variant="outline"
                  className="flex-col h-auto py-4 border-[#374151] hover:bg-[#374151]"
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-gray-400 mt-1">{description}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}