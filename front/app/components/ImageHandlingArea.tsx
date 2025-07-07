import React, { useState } from "react";
import type { FileStatus } from "@/types";
import PreviewGroup from "./Image/PreviewGroup";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2Icon, UploadIcon } from "lucide-react";
import ImageItem from "./Image/ImageItem";

// Helper component to handle individual image clicks

export interface ImageHandlingAreaProps {
  files: File[];
  fileStatuses: Map<string, FileStatus>;
  isProcessing: boolean;
  isProcessingAllFinished: boolean;

  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleSubmit: () => void;
  clearForm: () => void;
  removeFile: (fileName: string) => void;
  handleRetry: (fileName: string) => void;
  handleDownloadAll: () => void;
}

/**
 * A component for handling file uploads, previews, and translation initiation.
 */
export const ImageHandlingArea: React.FC<ImageHandlingAreaProps> = ({
  files,
  fileStatuses,
  isProcessing,
  isProcessingAllFinished,
  handleFileChange,
  handleDrop,
  handleSubmit,
  clearForm,
  removeFile,
  handleRetry,
  handleDownloadAll,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    const input = document.getElementById("file-input");
    if (input) {
      input.click();
    }
  };

  return (
    <div className="space-y-4 max-w-[1200px] mx-auto size-full">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => {
          handleDrop(e);
          setIsDragging(false);
        }}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex h-full min-h-52 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/bmp,image/webp"
          className="sr-only"
          onChange={handleFileChange}
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex h-full w-full flex-col gap-3 overflow-y-auto">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>
              {!isProcessing && !isProcessingAllFinished && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={openFileDialog}>
                    <UploadIcon
                      className="-ms-0.5 size-3.5 opacity-60"
                      aria-hidden="true"
                    />
                    Add more
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearForm}>
                    <Trash2Icon
                      className="-ms-0.5 size-3.5 opacity-60"
                      aria-hidden="true"
                    />
                    Remove all
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 p-1 overflow-y-auto overflow-x-hidden">
              <PreviewGroup
                items={files.map((file) => {
                  const status = fileStatuses.get(file.name);
                  return status?.result
                    ? URL.createObjectURL(status.result)
                    : URL.createObjectURL(file);
                })}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <ImageItem
                      key={file.name}
                      file={file}
                      index={index}
                      status={fileStatuses.get(file.name)}
                      isProcessing={isProcessing}
                      isProcessingAllFinished={isProcessingAllFinished}
                      removeFile={removeFile}
                      handleRetry={handleRetry}
                    />
                  ))}
                </div>
              </PreviewGroup>
            </div>
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                {isProcessingAllFinished && (
                  <>
                    <Button onClick={handleDownloadAll} size="sm">
                      Download All
                    </Button>
                    <Button onClick={clearForm} size="sm" variant="outline">
                      Start Over
                    </Button>
                  </>
                )}
              </div>
              {!isProcessing && !isProcessingAllFinished && (
                <Button
                  onClick={handleSubmit}
                  disabled={files.length === 0}
                  className="w-full sm:w-auto"
                >
                  Translate All Images
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, BMP, or WEBP
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select images
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
