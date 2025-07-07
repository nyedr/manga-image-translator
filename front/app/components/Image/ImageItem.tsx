import type { FileStatus } from "~/types";
import { processingStatuses } from "~/types";
import { usePreviewGroupContext } from "./PreviewGroup";
import Image from ".";
import { fetchStatusText } from "@/utils/fetchStatusText";
import { Button } from "@/components/ui/button";
import { XIcon, Loader2, AlertCircle, RefreshCwIcon } from "lucide-react";

const ImageItem: React.FC<{
  file: File;
  index: number;
  status: FileStatus | undefined;
  isProcessing: boolean;
  isProcessingAllFinished: boolean;
  removeFile: (fileName: string) => void;
  handleRetry: (fileName: string) => void;
}> = ({
  file,
  index,
  status,
  isProcessing,
  isProcessingAllFinished,
  removeFile,
  handleRetry,
}) => {
  const { setCurrent } = usePreviewGroupContext();

  const showOverlay = status?.status && status.status !== "finished";
  const isActuallyProcessing =
    status?.status && processingStatuses.includes(status.status);
  const isError = status?.status === "error";

  return (
    <div
      className="bg-accent relative aspect-square rounded-md"
      onClick={() => !isError && setCurrent(index)}
    >
      <Image
        src={
          status?.result
            ? URL.createObjectURL(status.result)
            : URL.createObjectURL(file)
        }
        alt={file.name}
        className="size-full rounded-[inherit] object-cover"
        // The actual click that opens the preview is on the AntD Image component itself.
        // Our wrapper's onClick sets the state right before that happens.
      />
      {/* Status overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-foreground/50 flex flex-col items-center justify-center rounded-lg gap-2 text-white p-4 text-center">
          {isActuallyProcessing && (
            <Loader2 className="animate-spin" size={40} />
          )}
          {isError && <AlertCircle size={40} />}
          <div className="text-sm font-medium">
            {fetchStatusText(
              status!.status!,
              status!.progress,
              status!.queuePos,
              status!.error
            )}
          </div>

          {isError && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRetry(file.name);
              }}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      )}
      {!isProcessing && !isProcessingAllFinished && (
        <Button
          onClick={(e) => {
            // Prevent the gallery from opening when the remove button is clicked
            e.stopPropagation();
            removeFile(file.name);
          }}
          size="icon"
          className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
          aria-label="Remove image"
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
    </div>
  );
};

export default ImageItem;
