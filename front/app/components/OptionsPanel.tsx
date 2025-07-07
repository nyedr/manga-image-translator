import React from "react";
import type { TranslatorKey } from "@/types";
import { validTranslators } from "@/types";
import { getTranslatorName } from "@/utils/getTranslatorName";
import {
  languageOptions,
  detectionResolutions,
  textDetectorOptions,
  inpaintingSizes,
  inpainterOptions,
  ocrOptions,
  rendererOptions,
  textDirectionOptions,
  fontOptions,
} from "@/config";
import { LabeledInput } from "@/components/LabeledInput";
import { LabeledSelect } from "@/components/LabeledSelect";

type OptionsPanelProps = {
  detectionResolution: string;
  textDetector: string;
  renderTextDirection: string;
  translator: TranslatorKey;
  targetLanguage: string;
  inpaintingSize: string;
  customUnclipRatio: number;
  customBoxThreshold: number;
  maskDilationOffset: number;
  inpainter: string;
  renderer: string;
  noHyphenation: boolean;
  fontSizeOffset: number;
  fontPath: string;
  fontSizeMinimum: number | null;
  fontSize: number | null;
  lineSpacing: number | null;
  ocr: string;
  ignoreBubble: number;
  setDetectionResolution: (value: string) => void;
  setTextDetector: (value: string) => void;
  setRenderTextDirection: (value: string) => void;
  setTranslator: (value: TranslatorKey) => void;
  setTargetLanguage: (value: string) => void;
  setInpaintingSize: (value: string) => void;
  setCustomUnclipRatio: (value: number) => void;
  setCustomBoxThreshold: (value: number) => void;
  setMaskDilationOffset: (value: number) => void;
  setInpainter: (value: string) => void;
  setRenderer: (value: string) => void;
  setNoHyphenation: (value: boolean) => void;
  setFontSizeOffset: (value: number) => void;
  setFontPath: (value: string) => void;
  setFontSizeMinimum: (value: number | null) => void;
  setFontSize: (value: number | null) => void;
  setLineSpacing: (value: number | null) => void;
  setOcr: (value: string) => void;
  setIgnoreBubble: (value: number) => void;
};

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  detectionResolution,
  textDetector,
  renderTextDirection,
  translator,
  targetLanguage,
  inpaintingSize,
  customUnclipRatio,
  customBoxThreshold,
  maskDilationOffset,
  inpainter,
  renderer,
  noHyphenation,
  fontSizeOffset,
  fontPath,
  fontSizeMinimum,
  fontSize,
  lineSpacing,
  ocr,
  ignoreBubble,
  setDetectionResolution,
  setTextDetector,
  setRenderTextDirection,
  setTranslator,
  setTargetLanguage,
  setInpaintingSize,
  setCustomUnclipRatio,
  setCustomBoxThreshold,
  setMaskDilationOffset,
  setInpainter,
  setRenderer,
  setNoHyphenation,
  setFontSizeOffset,
  setFontPath,
  setFontSizeMinimum,
  setFontSize,
  setLineSpacing,
  setOcr,
  setIgnoreBubble,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 size-full">
    {/* Column 1: Translation & Rendering */}
    <div className="p-6 border-r-1 space-y-6 bg-background h-full">
      {/* Translator Options */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Translator</h3>

        <div className="space-y-4">
          <LabeledSelect
            id="translator"
            label="Translator"
            icon="carbon:operations-record"
            title="Translator"
            value={translator}
            onChange={(val) => setTranslator(val as TranslatorKey)}
            options={validTranslators.map((key) => ({
              value: key,
              label: getTranslatorName(key),
            }))}
          />
          <LabeledSelect
            id="targetLanguage"
            label="Target Language"
            icon="carbon:language"
            title="Target language"
            value={targetLanguage}
            onChange={setTargetLanguage}
            options={languageOptions}
          />
        </div>
      </div>

      {/* Render Options */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Rendering</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledSelect
            id="renderer"
            label="Renderer"
            icon="carbon:magic-wand"
            value={renderer}
            onChange={(val) => setRenderer(val)}
            options={rendererOptions}
          />
          <LabeledSelect
            id="textDirection"
            label="Text Direction"
            icon="carbon:arrows-vertical"
            value={renderTextDirection}
            onChange={setRenderTextDirection}
            options={textDirectionOptions}
          />
          <LabeledSelect
            id="font"
            label="Font"
            icon="carbon:text-font"
            value={fontPath}
            onChange={(val) => setFontPath(val)}
            options={fontOptions}
          />
          <LabeledInput
            id="fontSizeOffset"
            label="Font Size Offset"
            icon="carbon:text-scale"
            type="number"
            value={fontSizeOffset}
            onChange={(val) => setFontSizeOffset(Number(val))}
          />
          <LabeledInput
            id="fontSizeMinimum"
            label="Font Size Minimum"
            icon="carbon:text-font"
            title="Minimum output font size (-1 for default)"
            type="number"
            value={fontSizeMinimum ?? -1}
            onChange={(val) =>
              setFontSizeMinimum(Number(val) === -1 ? null : Number(val))
            }
          />
          <LabeledInput
            id="fontSize"
            label="Font Size"
            icon="carbon:text-font"
            title="Use fixed font size for rendering"
            type="number"
            value={fontSize ?? 0}
            onChange={(val) =>
              setFontSize(Number(val) === 0 ? null : Number(val))
            }
          />
          <LabeledInput
            id="lineSpacing"
            label="Line Spacing"
            icon="carbon:text-line-spacing"
            title="Line spacing multiplier (font_size * this value)"
            type="number"
            step={0.01}
            value={lineSpacing ?? 0}
            onChange={(val) =>
              setLineSpacing(Number(val) === 0 ? null : Number(val))
            }
          />
          <div className="flex items-center mt-2 md:col-span-2">
            <input
              id="no-hyphenation"
              type="checkbox"
              checked={noHyphenation}
              onChange={(e) => setNoHyphenation(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="no-hyphenation"
              className="ml-2 block text-sm text-gray-900"
            >
              No Hyphenation
            </label>
          </div>
        </div>
      </div>
    </div>

    {/* Column 2: Image Processing */}
    <div className="p-6 border-r-1 space-y-6 bg-background h-full">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        Image Processing
      </h3>

      {/* Detection Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabeledSelect
          id="detectionResolution"
          label="Detection Resolution"
          icon="carbon:fit-to-screen"
          title="Detection resolution"
          value={detectionResolution}
          onChange={setDetectionResolution}
          options={detectionResolutions.map((res) => ({
            label: `${res}px`,
            value: String(res),
          }))}
        />
        <LabeledSelect
          id="textDetector"
          label="Text Detector"
          icon="carbon:search-locate"
          title="Text detector"
          value={textDetector}
          onChange={setTextDetector}
          options={textDetectorOptions}
        />
        <LabeledInput
          id="unclipRatio"
          label="Unclip Ratio"
          icon="weui:max-window-filled"
          title="Unclip ratio"
          step={0.01}
          value={customUnclipRatio}
          onChange={setCustomUnclipRatio}
        />
        <LabeledInput
          id="boxThreshold"
          label="Box Threshold"
          icon="weui:photo-wall-outlined"
          title="Box threshold"
          step={0.01}
          value={customBoxThreshold}
          onChange={setCustomBoxThreshold}
        />
        <LabeledInput
          id="maskDilationOffset"
          label="Mask Dilation Offset"
          icon="material-symbols:adjust-outline"
          title="Mask dilation offset"
          step={1}
          value={maskDilationOffset}
          onChange={setMaskDilationOffset}
        />
      </div>

      {/* Inpainting Options */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Inpainting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledSelect
            id="inpainter"
            label="Inpainter"
            icon="carbon:paint-brush"
            title="Inpainter"
            value={inpainter}
            onChange={setInpainter}
            options={inpainterOptions}
          />
          <LabeledSelect
            id="inpaintingSize"
            label="Inpainting Size"
            icon="carbon:paint-brush"
            title="Inpainting size"
            value={inpaintingSize}
            onChange={setInpaintingSize}
            options={inpaintingSizes.map((size) => ({
              label: `${size}px`,
              value: String(size),
            }))}
          />
        </div>
      </div>

      {/* OCR Options */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">OCR</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledSelect
            id="ocr"
            label="OCR Model"
            icon="carbon:string-text"
            title="Optical character recognition model to use"
            value={ocr}
            onChange={setOcr}
            options={ocrOptions}
          />
          <LabeledInput
            id="ignoreBubble"
            label="Ignore Bubble Threshold"
            icon="carbon:ibm-watson-text-to-speech"
            title="Threshold for ignoring non-bubble area text (1-50, 0 to disable)"
            type="number"
            value={ignoreBubble}
            onChange={(val) => setIgnoreBubble(Number(val))}
          />
        </div>
      </div>
    </div>
  </div>
);
