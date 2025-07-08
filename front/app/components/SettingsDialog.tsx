import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { LabeledInput } from "@/components/LabeledInput";

export interface CustomOpenAISettings {
  apiKey: string;
  apiBase: string;
  model: string;
  modelConf: string;
}

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomOpenAISettings;
  onSave: (settings: CustomOpenAISettings) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<CustomOpenAISettings>(settings);
  const [modelOptions, setModelOptions] = useState<ComboboxOption[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Update form data when settings prop changes
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Fetch models from OpenAI-compatible API
  const fetchModels = useCallback(async (apiBase: string) => {
    if (!apiBase || !apiBase.trim()) {
      setModelOptions([]);
      return;
    }

    setIsLoadingModels(true);
    setModelError(null);

    try {
      // Normalize the API base URL
      const baseUrl = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
      const modelsUrl = baseUrl.endsWith("/v1")
        ? `${baseUrl}/models`
        : `${baseUrl}/v1/models`;

      const response = await fetch(modelsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch models: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        const options: ComboboxOption[] = data.data.map((model: any) => ({
          value: model.id,
          label: model.id,
        }));
        setModelOptions(options);
      } else {
        throw new Error("Invalid response format from models endpoint");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setModelError(
        error instanceof Error ? error.message : "Failed to fetch models"
      );
      setModelOptions([]);
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  // Fetch models when API base changes
  useEffect(() => {
    if (formData.apiBase) {
      fetchModels(formData.apiBase);
    }
  }, [formData.apiBase, fetchModels]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: CustomOpenAISettings = {
      apiKey: "",
      apiBase: "http://localhost:11434/v1",
      model: "",
      modelConf: "",
    };
    setFormData(defaultSettings);
  };

  const handleRefreshModels = () => {
    if (formData.apiBase) {
      fetchModels(formData.apiBase);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Custom OpenAI Settings</DialogTitle>
          <DialogDescription>
            Configure your custom OpenAI-compatible API settings. These will
            override the default Docker image settings.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <LabeledInput
            id="apiKey"
            label="API Key"
            icon="mdi:key-variant"
            type="password"
            value={formData.apiKey}
            onChange={(value) =>
              setFormData({ ...formData, apiKey: value as string })
            }
            placeholder="Enter your API key (e.g., ollama)"
            tooltip="API key for authenticating with your OpenAI-compatible service. Not needed for local Ollama instances."
          />

          <LabeledInput
            id="apiBase"
            label="API Base URL"
            icon="mdi:web"
            type="text"
            value={formData.apiBase}
            onChange={(value) =>
              setFormData({ ...formData, apiBase: value as string })
            }
            placeholder="Enter base URL (e.g., http://localhost:11434/v1)"
            tooltip="The base URL for your OpenAI-compatible API endpoint. For Ollama, this is typically http://localhost:11434/v1"
          />

          <div className="grid w-full items-center gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Model Name</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefreshModels}
                disabled={isLoadingModels || !formData.apiBase}
                className="h-auto p-1 text-xs"
              >
                <Icon
                  icon={isLoadingModels ? "mdi:loading" : "mdi:refresh"}
                  className={`h-3 w-3 ${isLoadingModels ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
            <Combobox
              value={formData.model}
              onChange={(value) => setFormData({ ...formData, model: value })}
              options={modelOptions}
              icon="mdi:brain"
              placeholder={
                isLoadingModels
                  ? "Loading models..."
                  : modelError
                  ? "Error loading models"
                  : modelOptions.length === 0
                  ? "Enter API Base URL to load models"
                  : "Select a model..."
              }
              searchPlaceholder="Search models..."
              emptyMessage="No models found"
              disabled={isLoadingModels || modelError !== null}
            />
            {modelError && (
              <p className="text-sm text-destructive">{modelError}</p>
            )}
            {!modelError &&
              modelOptions.length === 0 &&
              !isLoadingModels &&
              formData.apiBase && (
                <p className="text-sm text-muted-foreground">
                  No models found. Make sure the API base URL is correct and the
                  service is running.
                </p>
              )}
          </div>

          <LabeledInput
            id="modelConf"
            label="Model Configuration Key"
            icon="mdi:cog"
            type="text"
            value={formData.modelConf}
            onChange={(value) =>
              setFormData({ ...formData, modelConf: value as string })
            }
            placeholder="Optional: nested config key (e.g., my-model)"
          />

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Model Configuration Key:</strong> Used to specify
              different configuration sections in your GPT config file. Default
              is 'ollama', but providing a key like 'my-model' creates
              'ollama.my-model' for separate model configurations.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
