import React from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type LabeledInputProps = {
  id: string;
  label: string;
  icon: string;
  title?: string;
  type?: React.InputHTMLAttributes<unknown>["type"];
  step?: number | string;
  value: number;
  onChange: (value: number) => void;
};

export const LabeledInput: React.FC<LabeledInputProps> = ({
  id,
  label,
  icon,
  title,
  type = "number",
  step,
  value,
  onChange,
}) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
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
            onChange(Number(e.target.value));
          }}
          className="pl-8"
        />
      </div>
    </div>
  );
};
