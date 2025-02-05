import React from "react";
import { ChevronDown } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  isModelOpen: boolean;
  setIsModelOpen: (isOpen: boolean) => void;
  setSelectedModel: (model: string) => void;
  models: string[];
  direction?: "up" | "down";
}

export function ModelSelector({
  selectedModel,
  isModelOpen,
  setIsModelOpen,
  setSelectedModel,
  models,
  direction = "down", // Default to downward
}: ModelSelectorProps) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsModelOpen(!isModelOpen)}
        className="text-purple-400 flex items-center gap-1 hover:bg-white/5 py-1 px-2 rounded"
      >
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
        {selectedModel}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isModelOpen && (
        <div
          className={`absolute ${
            direction === "up" ? "bottom-full mb-1" : "top-full mt-1"
          } right-0 w-36 bg-black/50 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg py-1 z-50`}
        >
          {models.map((model) => (
            <button
              key={model}
              className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-gray-200"
              onClick={() => {
                setSelectedModel(model);
                setIsModelOpen(false);
              }}
            >
              {model}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
