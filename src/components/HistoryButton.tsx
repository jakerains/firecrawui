import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useHistoryStore } from '@/lib/stores/history-store';
import { format } from 'date-fns';
import ResultsModal from './ResultsModal';
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline';

interface HistoryButtonProps {
  type: 'crawl' | 'scrape' | 'extract' | 'map';
}

export default function HistoryButton({ type }: HistoryButtonProps) {
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const { entries } = useHistoryStore();

  // Filter entries by type and only successful ones with results
  const typeEntries = entries.filter(
    entry => entry.type === type && entry.status === 'success' && entry.results
  );

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
          >
            <ClockIcon className="w-4 h-4" />
            History
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0 bg-[#1f2937] border-[#374151]"
          align="end"
        >
          <ScrollArea className="h-64">
            {typeEntries.length > 0 ? (
              <div className="divide-y divide-[#374151]">
                {typeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 hover:bg-gray-800/50 cursor-pointer flex items-center justify-between"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">
                        {entry.url}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(entry.timestamp), 'PPp')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 hover:bg-gray-700/50"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No history available</p>
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedEntry && (
        <ResultsModal
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          results={selectedEntry.results}
          jobType={type}
        />
      )}
    </>
  );
}