import React from "react";
import { Icon } from "@iconify/react";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type LabeledInputProps = {
  id: string;
  label: string;
  icon: string;
  title?: string;
  tooltip?: string;
  type?: React.InputHTMLAttributes<unknown>["type"];
  step?: number | string;
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
};

export const LabeledInput: React.FC<LabeledInputProps> = ({
  id,
  label,
  icon,
  title,
  tooltip,
  type = "number",
  step,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <div className="flex items-center gap-1">
        <Label htmlFor={id} className="text-sm font-medium whitespace-nowrap">
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs w-fit">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        <Icon
          icon={icon}
          className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground h-4 w-4"
        />
        <Input
          id={id}
          title={title}
          type={type}
          step={step}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(type === "number" ? Number(val) : val);
          }}
          placeholder={placeholder}
          className="pl-8"
        />
      </div>
    </div>
  );
};
