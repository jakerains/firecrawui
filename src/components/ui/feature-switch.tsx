import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface FeatureSwitchProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultChecked?: boolean;
  accentColor?: string;
}

export function FeatureSwitch({
  id,
  icon,
  title,
  description,
  defaultChecked,
  accentColor = 'blue'
}: FeatureSwitchProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/40 rounded-lg border border-gray-700/30">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md bg-${accentColor}-500/10`}>
          {icon}
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor={id} className="font-medium cursor-help">
                {title}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{description}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <Switch
        id={id}
        defaultChecked={defaultChecked}
        className={`data-[state=checked]:bg-${accentColor}-500`}
      />
    </div>
  );
}