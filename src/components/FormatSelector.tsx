import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormatType, formatters } from '@/lib/utils/formatters';
import {
  DocumentTextIcon,
  CodeBracketIcon,
  TableCellsIcon,
  DocumentIcon,
  DocumentDuplicateIcon,
  CodeBracketSquareIcon,
} from '@heroicons/react/24/outline';

interface FormatOption {
  value: FormatType;
  label: string;
  icon: typeof DocumentTextIcon;
  description: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    value: 'json',
    label: 'JSON',
    icon: CodeBracketIcon,
    description: 'Structured data format',
  },
  {
    value: 'yaml',
    label: 'YAML',
    icon: CodeBracketSquareIcon,
    description: 'Human-readable data format',
  },
  {
    value: 'csv',
    label: 'CSV',
    icon: TableCellsIcon,
    description: 'Spreadsheet compatible',
  },
  {
    value: 'markdown',
    label: 'Markdown',
    icon: DocumentTextIcon,
    description: 'Rich text formatting',
  },
  {
    value: 'html',
    label: 'HTML',
    icon: CodeBracketIcon,
    description: 'Web-ready format',
  },
  {
    value: 'txt',
    label: 'Plain Text',
    icon: DocumentIcon,
    description: 'Simple text format',
  },
  {
    value: 'xml',
    label: 'XML',
    icon: CodeBracketSquareIcon,
    description: 'Extensible markup format',
  },
];

interface FormatSelectorProps {
  currentFormat: FormatType;
  onFormatChange: (format: FormatType) => void;
  onDownload: (options: { format: FormatType; filename?: string }) => void;
}

export default function FormatSelector({ 
  currentFormat, 
  onFormatChange, 
  onDownload 
}: FormatSelectorProps) {
  const [customFilename, setCustomFilename] = useState('');
  const [useTimestamp, setUseTimestamp] = useState(true);

  const handleDownload = () => {
    onDownload({
      format: currentFormat,
      filename: customFilename || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {FORMAT_OPTIONS.map(({ value, label, icon: Icon, description }) => (
          <div
            key={value}
            className={`
              relative p-4 rounded-lg cursor-pointer transition-all duration-200
              ${currentFormat === value 
                ? 'bg-blue-500/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                : 'bg-gray-800/20 border-gray-700/30'
              }
              border hover:border-blue-500/30 hover:bg-blue-500/10
            `}
            onClick={() => onFormatChange(value)}
          >
            <div className="flex items-start space-x-3">
              <Icon className={`h-5 w-5 ${currentFormat === value ? 'text-blue-400' : 'text-gray-400'}`} />
              <div>
                <h3 className={`text-sm font-medium ${currentFormat === value ? 'text-blue-300' : 'text-gray-300'}`}>
                  {label}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800">
        <div className="space-y-2">
          <Label htmlFor="filename" className="text-sm text-gray-300">Custom Filename (Optional)</Label>
          <Input
            id="filename"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            placeholder={`firecrawl-data.${formatters[currentFormat].extension}`}
            className="bg-gray-800/20 border-gray-700"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="use-timestamp" className="text-sm text-gray-300">Include Timestamp</Label>
            <p className="text-xs text-gray-500">Add date and time to filename</p>
          </div>
          <Switch
            id="use-timestamp"
            checked={useTimestamp}
            onCheckedChange={setUseTimestamp}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        <Button
          onClick={handleDownload}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
          Download as {FORMAT_OPTIONS.find(f => f.value === currentFormat)?.label}
        </Button>
      </div>
    </div>
  );
}