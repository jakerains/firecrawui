import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHistoryStore, type HistoryEntry } from '@/lib/stores/history-store';
import { StorageService } from '@/lib/services/storage';
import ResultsModal from '@/components/ResultsModal';
import { useToast } from '@/hooks/use-toast';
import {
  ClockIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  BugAntIcon,
  CommandLineIcon,
  BeakerIcon,
  MapIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

const TYPE_ICONS = {
  crawl: BugAntIcon,
  scrape: CommandLineIcon,
  extract: BeakerIcon,
  map: MapIcon,
};

const DOWNLOAD_FORMATS = [
  { id: 'json', label: 'JSON', icon: DocumentTextIcon },
  { id: 'csv', label: 'CSV', icon: TableCellsIcon },
  { id: 'txt', label: 'Text', icon: DocumentDuplicateIcon },
];

export default function HistoryPanel() {
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const { entries, clearHistory, removeEntry } = useHistoryStore();
  const { toast } = useToast();
  const storage = new StorageService();

  const filteredEntries = entries.filter((entry) =>
    entry.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: 'History Cleared',
      description: 'All history entries have been removed.',
    });
  };

  const handleRemoveEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeEntry(id);
    toast({
      title: 'Entry Removed',
      description: 'History entry has been removed.',
    });
  };

  const handleDownloadEntry = async (entry: HistoryEntry, format: string) => {
    try {
      if (!entry.results) {
        toast({
          title: 'No Results',
          description: 'This entry has no results to download.',
          variant: 'destructive',
        });
        return;
      }

      const timestamp = format(new Date(entry.timestamp), 'yyyy-MM-dd-HHmmss');
      const filename = `firecrawl-${entry.type}-${timestamp}`;

      await storage.saveFile(entry.results, {
        filename,
        format: format as any,
        timestamp: false, // Already included in filename
      });

      toast({
        title: 'Download Complete',
        description: `Results downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download results. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExportAllHistory = async (format: string) => {
    try {
      const exportData = entries.map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        type: entry.type,
        url: entry.url,
        status: entry.status,
        error: entry.error,
        hasResults: !!entry.results,
      }));

      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
      await storage.saveFile(exportData, {
        filename: `firecrawl-history-${timestamp}`,
        format: format as any,
        timestamp: false,
      });

      toast({
        title: 'History Exported',
        description: `History exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export history. Please try again.',
        variant: 'destructive',
      });
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
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                  <ClockIcon className="mr-3 h-6 w-6 text-gray-400" />
                  Operation History
                </h2>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Export History
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-[#1f2937] border-[#374151]">
                    {DOWNLOAD_FORMATS.map(({ id, label, icon: Icon }) => (
                      <DropdownMenuItem
                        key={id}
                        onClick={() => handleExportAllHistory(id)}
                        className="gap-2 cursor-pointer"
                      >
                        <Icon className="w-4 h-4" />
                        Export as {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-6">
                {/* Search and Clear */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-[#2a3441]/50 border-[#4b5563]/50"
                      placeholder="Search by URL..."
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleClearHistory}
                    className="gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Clear History
                  </Button>
                </div>

                {/* History List */}
                <ScrollArea className="h-[calc(100vh-300px)] rounded-lg border border-[#374151]">
                  <AnimatePresence>
                    {filteredEntries.length > 0 ? (
                      <div className="divide-y divide-[#374151]">
                        {filteredEntries.map((entry) => {
                          const Icon = TYPE_ICONS[entry.type];
                          return (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`
                                p-4 hover:bg-gray-800/30
                                transition-colors duration-200
                                ${entry.results ? 'cursor-pointer' : ''}
                              `}
                              onClick={() => entry.results && setSelectedEntry(entry)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-200 truncate max-w-md">
                                      {entry.url}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {format(new Date(entry.timestamp), 'PPpp')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {entry.status === 'success' ? (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <XCircleIcon className="w-5 h-5 text-red-500" />
                                  )}
                                  <div className="flex gap-2">
                                    {entry.results && (
                                      <>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="hover:bg-gray-700/50"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <ArrowDownTrayIcon className="w-4 h-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-48 bg-[#1f2937] border-[#374151]">
                                            {DOWNLOAD_FORMATS.map(({ id, label, icon: Icon }) => (
                                              <DropdownMenuItem
                                                key={id}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDownloadEntry(entry, id);
                                                }}
                                                className="gap-2 cursor-pointer"
                                              >
                                                <Icon className="w-4 h-4" />
                                                Download as {label}
                                              </DropdownMenuItem>
                                            ))}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="hover:bg-gray-700/50"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEntry(entry);
                                          }}
                                        >
                                          <EyeIcon className="w-4 h-4" />
                                        </Button>
                                      </>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="hover:bg-red-500/20 hover:text-red-400"
                                      onClick={(e) => handleRemoveEntry(entry.id, e)}
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {entry.error && (
                                <p className="mt-2 text-sm text-red-400">
                                  Error: {entry.error}
                                </p>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <ClockIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No history entries found</p>
                        <p className="text-sm">
                          {search
                            ? 'Try adjusting your search terms'
                            : 'Start crawling, scraping, or extracting to see your history'}
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {selectedEntry?.results && (
        <ResultsModal
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          results={selectedEntry.results}
          jobType={selectedEntry.type}
        />
      )}
    </>
  );
}