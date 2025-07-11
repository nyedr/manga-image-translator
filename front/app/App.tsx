import React, { useState, useEffect, useMemo } from "react";
import {
  type StatusKey,
  processingStatuses,
  type TranslatorKey,
  type FileStatus,
  type ChunkProcessingResult,
} from "@/types";
import { imageMimeTypes } from "@/config";
import { OptionsPanel } from "@/components/OptionsPanel";
import { ImageHandlingArea } from "@/components/ImageHandlingArea";
import { Header } from "@/components/Header";
import {
  SettingsDialog,
  type CustomOpenAISettings,
} from "@/components/SettingsDialog";
import JSZip from "jszip";

export const App: React.FC = () => {
  // State Hooks
  const [fileStatuses, setFileStatuses] = useState<Map<string, FileStatus>>(
    new Map()
  );
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Settings Dialog State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Local storage key for custom OpenAI settings
  const STORAGE_KEY = "manga-translator-custom-openai-settings";

  // Load settings from localStorage or use defaults
  const loadSettingsFromStorage = (): CustomOpenAISettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that all required fields exist
        if (
          parsed.apiKey !== undefined &&
          parsed.apiBase !== undefined &&
          parsed.model !== undefined &&
          parsed.modelConf !== undefined
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn(
        "Failed to load custom OpenAI settings from localStorage:",
        error
      );
    }

    // Return default settings if loading fails or no stored settings
    return {
      apiKey: "",
      apiBase: "http://localhost:11434/v1",
      model: "",
      modelConf: "",
    };
  };

  const [customOpenAISettings, setCustomOpenAISettings] =
    useState<CustomOpenAISettings>(loadSettingsFromStorage);

  // Translation Options State Hooks
  const [detectionResolution, setDetectionResolution] = useState("2560");
  const [textDetector, setTextDetector] = useState("default");
  const [renderTextDirection, setRenderTextDirection] = useState("auto");
  const [translator, setTranslator] = useState<TranslatorKey>("custom_openai");
  const [targetLanguage, setTargetLanguage] = useState("ENG");

  const [inpaintingSize, setInpaintingSize] = useState("2560");
  const [customUnclipRatio, setCustomUnclipRatio] = useState<number>(2.6);
  const [customBoxThreshold, setCustomBoxThreshold] = useState<number>(0.7);
  const [maskDilationOffset, setMaskDilationOffset] = useState<number>(45);
  const [inpainter, setInpainter] = useState("lama_large");

  const [renderer, setRenderer] = useState("manga2eng");
  const [noHyphenation, setNoHyphenation] = useState(true);
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [fontPath, setFontPath] = useState("fonts/NotoSansMonoCJK-VF.ttf.ttc");

  const [fontSizeMinimum, setFontSizeMinimum] = useState<number | null>(-1);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [lineSpacing, setLineSpacing] = useState<number | null>(null);
  const [ocr, setOcr] = useState("48px");
  const [ignoreBubble, setIgnoreBubble] = useState(0);

  // Computed State (useMemo)
  const isProcessing = useMemo(() => {
    // If there are no files or no statuses, we're not processing
    if (files.length === 0 || fileStatuses.size === 0) return false;

    // Check if any file has a processing status
    return Array.from(fileStatuses.values()).some((fileStatus) => {
      if (!fileStatus || fileStatus.status === null) return false;
      return processingStatuses.includes(fileStatus.status);
    });
  }, [files, fileStatuses]);

  const isProcessingAllFinished = useMemo(() => {
    // If there are no files or no statuses, we're not finished
    if (files.length === 0 || fileStatuses.size === 0) return false;

    // Check if all files are finished
    return Array.from(fileStatuses.values()).every((status) => {
      if (!status || status.status === null) return false;
      return status.status === "finished";
    });
  }, [files, fileStatuses]);

  // Effects
  /** クリップボード ペースト対応 */
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.kind === "file") {
          const pastedFile = item.getAsFile();
          if (pastedFile && imageMimeTypes.includes(pastedFile.type)) {
            setFiles((prev) => [...prev, pastedFile]);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste as EventListener);
    return () =>
      window.removeEventListener("paste", handlePaste as EventListener);
  }, []);

  useEffect(() => {
    if (shouldTranslate) {
      processTranslation();
      setShouldTranslate(false);
    }
  }, [fileStatuses]);

  // Event Handlers
  /** フォーム再セット */
  const clearForm = () => {
    setFiles([]);
    setFileStatuses(() => new Map());
  };

  // Settings Dialog Handlers
  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handleSettingsSave = (settings: CustomOpenAISettings) => {
    setCustomOpenAISettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  /** ドラッグ＆ドロップ対応 */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    const validFiles = droppedFiles.filter((file) =>
      imageMimeTypes.includes(file.type)
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  /** ファイル選択時 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) =>
      imageMimeTypes.includes(file.type)
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove file handler
  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    setFileStatuses((prev) => {
      const newStatuses = new Map(prev);
      newStatuses.delete(fileName);
      return newStatuses;
    });
  };

  /**
   * フォーム送信 (翻訳リクエスト)
   */
  const handleSubmit = () => {
    if (files.length === 0) return;

    resetFileStatuses();
    setShouldTranslate(true);
  };

  // Translation Processing - Configeration
  const buildTranslationConfig = (): string => {
    // Helper function to convert localhost URLs to Docker-compatible URLs
    const convertUrlForDocker = (url: string): string => {
      if (!url) return url;

      // Convert localhost to Docker networking
      if (url.includes("localhost") || url.includes("127.0.0.1")) {
        // For Windows/Mac Docker Desktop
        if (
          navigator.platform.includes("Win") ||
          navigator.platform.includes("Mac")
        ) {
          return url.replace(/localhost|127\.0\.0\.1/g, "host.docker.internal");
        }
        // For Linux Docker
        else {
          return url.replace(/localhost|127\.0\.0\.1/g, "172.17.0.1");
        }
      }
      return url;
    };

    const translatorConfig: any = {
      translator: translator,
      target_lang: targetLanguage,
    };

    // Add custom OpenAI settings if using custom_openai translator
    if (translator === "custom_openai") {
      translatorConfig.custom_openai_api_key = customOpenAISettings.apiKey;
      translatorConfig.custom_openai_api_base = convertUrlForDocker(
        customOpenAISettings.apiBase
      );
      translatorConfig.custom_openai_model = customOpenAISettings.model;
      translatorConfig.custom_openai_model_conf =
        customOpenAISettings.modelConf;
    }

    return JSON.stringify({
      detector: {
        detector: textDetector,
        detection_size: detectionResolution,
        box_threshold: customBoxThreshold,
        unclip_ratio: customUnclipRatio,
      },
      render: {
        renderer: renderer,
        direction: renderTextDirection,
        no_hyphenation: noHyphenation,
        font_size_offset: fontSizeOffset,
        font_size_minimum: fontSizeMinimum,
        font_size: fontSize,
        line_spacing: lineSpacing,
      },
      translator: translatorConfig,
      inpainter: {
        inpainter: inpainter,
        inpainting_size: inpaintingSize,
      },
      ocr: {
        ocr: ocr,
        ignore_bubble: ignoreBubble,
      },
      mask_dilation_offset: maskDilationOffset,
      font_path: fontPath,
    });
  };

  // Translation Processing - Network Request
  const requestTranslation = async (file: File, config: string) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("config", config);

    const response = await fetch(`/api/translate/with-form/image/stream`, {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      throw new Error("Upload failed");
    }

    return response;
  };

  // Translation Processing - Chunk Processing
  const processChunk = async (
    value: Uint8Array,
    fileId: string,
    currentBuffer: Uint8Array
  ): Promise<ChunkProcessingResult> => {
    // Check for existing errors first
    if (fileStatuses.get(fileId)?.error) {
      throw new Error(
        `Processing stopped due to previous error for file ${fileId}`
      );
    }

    // Combine buffers
    const newBuffer = new Uint8Array(currentBuffer.length + value.length);
    newBuffer.set(currentBuffer);
    newBuffer.set(value, currentBuffer.length);
    let processedBuffer = newBuffer;

    // Process all complete messages in buffer
    while (processedBuffer.length >= 5) {
      const dataSize = new DataView(processedBuffer.buffer).getUint32(1, false);
      const totalSize = 5 + dataSize;
      if (processedBuffer.length < totalSize) break;

      const statusCode = processedBuffer[0];
      const data = processedBuffer.slice(5, totalSize);
      const decodedData = new TextDecoder("utf-8").decode(data);

      processStatusUpdate(statusCode, decodedData, fileId, data);
      processedBuffer = processedBuffer.slice(totalSize);
    }

    return { updatedBuffer: processedBuffer };
  };

  // Translation Processing - Single File Stream Processing
  const processSingleFileStream = async (file: File, config: string) => {
    try {
      const response = await requestTranslation(file, config);
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get stream reader");
      }

      let fileBuffer = new Uint8Array();

      while (true) {
        const { done, value } = await reader.read();
        if (done || !value) break;

        try {
          const result = await processChunk(value, file.name, fileBuffer);
          fileBuffer = result.updatedBuffer;
        } catch (error) {
          console.error(`Error processing chunk for ${file.name}:`, error);
          updateFileStatus(file.name, {
            status: "error",
            error:
              error instanceof Error ? error.message : "Error processing chunk",
          });
        }
      }
    } catch (err) {
      console.error("Error processing file: ", file.name, err);
      updateFileStatus(file.name, {
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleRetry = (fileName: string) => {
    const fileToRetry = files.find((f) => f.name === fileName);
    if (fileToRetry) {
      updateFileStatus(fileName, {
        status: null,
        progress: null,
        queuePos: null,
        result: null,
        error: null,
      });
      const config = buildTranslationConfig();
      processSingleFileStream(fileToRetry, config);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    fileStatuses.forEach((status, fileName) => {
      if (status.status === "finished" && status.result) {
        zip.file(fileName, status.result);
      }
    });

    if (Object.keys(zip.files).length > 0) {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "translated_images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Translation Processing - Overall Translation Batch Process
  const processTranslation = async () => {
    const config = buildTranslationConfig();

    // Process all files in parallel
    try {
      await Promise.all(
        files.map((file) => processSingleFileStream(file, config))
      );
    } catch (err) {
      console.error("Translation process failed:", err);
    }
  };

  // Helper to reset file statuses
  const resetFileStatuses = () => {
    // Initialize status for all files
    const newStatuses = new Map();
    files.forEach((file) => {
      newStatuses.set(file.name, {
        status: null,
        progress: null,
        queuePos: null,
        result: null,
        error: null,
      });
    });
    setFileStatuses(newStatuses);
  };

  // Helper to update status for a specific file
  const updateFileStatus = (fileId: string, update: Partial<FileStatus>) => {
    setFileStatuses((prev) => {
      const newStatuses = new Map(prev);
      const currentStatus = newStatuses.get(fileId) || {
        status: null,
        progress: null,
        queuePos: null,
        result: null,
        error: null,
      };
      const updatedStatus = { ...currentStatus, ...update };
      newStatuses.set(fileId, updatedStatus);
      return newStatuses;
    });
  };

  // Helper to process status updates
  const processStatusUpdate = (
    statusCode: number,
    decodedData: string,
    fileId: string,
    data: Uint8Array
  ): void => {
    switch (statusCode) {
      case 0: // 結果が返ってきた
        updateFileStatus(fileId, {
          status: "finished",
          result: new Blob([data], { type: "image/png" }),
        });
        break;
      case 1: // 翻訳中
        const newStatus = decodedData as StatusKey;
        updateFileStatus(fileId, { status: newStatus });
        break;
      case 2: // エラー
        updateFileStatus(fileId, {
          status: "error",
          error: decodedData,
        });
        break;
      case 3: // キューに追加された
        updateFileStatus(fileId, {
          status: "pending",
          queuePos: decodedData,
        });
        break;
      case 4: // キューがクリアされた
        updateFileStatus(fileId, {
          status: "pending",
          queuePos: null,
        });
        break;
      default: // 未知のステータスコード
        console.warn(`Unknown status code ${statusCode} for file ${fileId}`);
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onSettingsClick={handleSettingsClick} />
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        onSave={handleSettingsSave}
        settings={customOpenAISettings}
      />
      <div className="bg-slate-100 flex-1 flex max-h-[calc(100vh-64px)] overflow-y-hidden">
        <OptionsPanel
          detectionResolution={detectionResolution}
          textDetector={textDetector}
          renderTextDirection={renderTextDirection}
          translator={translator}
          targetLanguage={targetLanguage}
          inpaintingSize={inpaintingSize}
          customUnclipRatio={customUnclipRatio}
          customBoxThreshold={customBoxThreshold}
          maskDilationOffset={maskDilationOffset}
          inpainter={inpainter}
          setDetectionResolution={setDetectionResolution}
          setTextDetector={setTextDetector}
          setRenderTextDirection={setRenderTextDirection}
          setTranslator={setTranslator}
          setTargetLanguage={setTargetLanguage}
          setInpaintingSize={setInpaintingSize}
          setCustomUnclipRatio={setCustomUnclipRatio}
          setCustomBoxThreshold={setCustomBoxThreshold}
          setMaskDilationOffset={setMaskDilationOffset}
          setInpainter={setInpainter}
          renderer={renderer}
          noHyphenation={noHyphenation}
          fontSizeOffset={fontSizeOffset}
          fontPath={fontPath}
          setRenderer={setRenderer}
          setNoHyphenation={setNoHyphenation}
          setFontSizeOffset={setFontSizeOffset}
          setFontPath={setFontPath}
          fontSizeMinimum={fontSizeMinimum}
          fontSize={fontSize}
          lineSpacing={lineSpacing}
          ocr={ocr}
          ignoreBubble={ignoreBubble}
          setFontSizeMinimum={setFontSizeMinimum}
          setFontSize={setFontSize}
          setLineSpacing={setLineSpacing}
          setOcr={setOcr}
          setIgnoreBubble={setIgnoreBubble}
        />
        <ImageHandlingArea
          files={files}
          fileStatuses={fileStatuses}
          isProcessing={isProcessing}
          isProcessingAllFinished={isProcessingAllFinished}
          handleFileChange={handleFileChange}
          handleDrop={handleDrop}
          handleSubmit={handleSubmit}
          clearForm={clearForm}
          removeFile={removeFile}
          handleRetry={handleRetry}
          handleDownloadAll={handleDownloadAll}
        />
      </div>
    </div>
  );
};

export default App;
