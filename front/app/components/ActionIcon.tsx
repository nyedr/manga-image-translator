import { Button } from "@/components/Button";

export default function ActionIcon({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="cursor-pointer border-background focus-visible:border-background"
      {...props}
    >
      {children}
    </Button>
  );
}
