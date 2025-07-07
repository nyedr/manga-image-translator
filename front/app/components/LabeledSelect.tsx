import React from "react";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type LabeledSelectOption = {
  label: string;
  value: string;
};

type LabeledSelectProps = {
  id: string;
  label: string;
  icon: string;
  title?: string;
  value: string;
  options: LabeledSelectOption[];
  onChange: (value: string) => void;
};

export const LabeledSelect: React.FC<LabeledSelectProps> = ({
  id,
  label,
  icon,
  title,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger id={id} title={title} className="pl-8 w-full relative">
          <Icon
            icon={icon}
            className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground h-4 w-4"
          />
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
