import { Label } from '@/components/ui/label';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TooltipLabelProps {
  htmlFor: string;
  label: string;
  tooltip: React.ReactNode;
}

export function TooltipLabel({ htmlFor, label, tooltip }: TooltipLabelProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Label 
          htmlFor={htmlFor} 
          className="text-sm font-medium text-gray-200 cursor-help flex items-center gap-2"
        >
          {label}
        </Label>
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-xs">{tooltip}</div>
      </TooltipContent>
    </Tooltip>
  );
}