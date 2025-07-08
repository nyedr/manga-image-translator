import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // Update form data when settings prop changes
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleInputChange = (
    field: keyof CustomOpenAISettings,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(settings); // Reset to original settings
    onClose();
  };

  const handleReset = () => {
    setFormData({
      apiKey: "ollama",
      apiBase: "http://localhost:11434/v1",
      model: "",
      modelConf: "",
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Custom OpenAI Settings
                </Dialog.Title>

                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Configure custom OpenAI-compatible API settings for the
                    custom_openai translator. These settings will override the
                    default docker image configuration.
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="api-key" className="text-sm font-medium">
                      API Key
                    </Label>
                    <Input
                      id="api-key"
                      type="text"
                      value={formData.apiKey}
                      onChange={(e) =>
                        handleInputChange("apiKey", e.target.value)
                      }
                      placeholder="ollama"
                    />
                    <div className="text-xs text-gray-500">
                      API key for OpenAI-compatible services (not needed for
                      Ollama)
                    </div>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="api-base" className="text-sm font-medium">
                      API Base URL
                    </Label>
                    <Input
                      id="api-base"
                      type="text"
                      value={formData.apiBase}
                      onChange={(e) =>
                        handleInputChange("apiBase", e.target.value)
                      }
                      placeholder="http://localhost:11434/v1"
                    />
                    <div className="text-xs text-gray-500">
                      Base URL for the OpenAI-compatible API endpoint
                    </div>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="model" className="text-sm font-medium">
                      Model
                    </Label>
                    <Input
                      id="model"
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        handleInputChange("model", e.target.value)
                      }
                      placeholder="e.g., qwen2.5:7b"
                    />
                    <div className="text-xs text-gray-500">
                      Model name to use (ensure it's pulled and running)
                    </div>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="model-conf" className="text-sm font-medium">
                      Model Configuration
                    </Label>
                    <Input
                      id="model-conf"
                      type="text"
                      value={formData.modelConf}
                      onChange={(e) =>
                        handleInputChange("modelConf", e.target.value)
                      }
                      placeholder="e.g., qwen2"
                    />
                    <div className="text-xs text-gray-500">
                      Model configuration key for additional settings
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    onClick={handleReset}
                  >
                    Reset to Defaults
                  </button>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      onClick={handleSave}
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
