import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Loader2, X, Beef } from "lucide-react";
import { ModelSelector } from "./ModelSelector";

interface ChatInterfaceProps {
  initialMessage: string;
  selectedModel: string;
  onClose: () => void;
  models: string[];
  setSelectedModel: (model: string) => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatInterface({
  initialMessage,
  selectedModel,
  onClose,
  models,
  setSelectedModel,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false); // Add this state
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Simulate AI response (replace with actual API call)
  const simulateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const aiMessage = {
      id: `ai-${Date.now()}`,
      text: `This is a simulated response to: "${userMessage}"`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialMessage.trim()) {
      const userMessage = {
        id: `user-${Date.now()}`,
        text: initialMessage,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      simulateAIResponse(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = {
        id: `user-${Date.now()}`,
        text: inputValue,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      await simulateAIResponse(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Add this function to handle model selection
  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setIsModelOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-black/20 backdrop-blur-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Beef className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Vault AI Assistant
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[calc(100vh-180px)]"
      >
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <div className="p-3 rounded-full bg-white/5 backdrop-blur-sm">
              <Beef className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-lg">How can I help you today?</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-purple-500/80 backdrop-blur-sm text-white border border-purple-400/20"
                  : "bg-white/5 backdrop-blur-sm text-gray-100 border border-white/10"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 border border-white/10">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input Area */}
      <div className="p-4 border-t border-white/5 bg-black/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-4 pr-32 focus:outline-none focus:border-purple-500 placeholder-gray-500 text-sm backdrop-blur-sm text-white"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <ModelSelector
                selectedModel={selectedModel}
                isModelOpen={isModelOpen}
                setIsModelOpen={setIsModelOpen}
                setSelectedModel={handleModelSelect}
                models={models}
                direction="up" // Add this prop
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="p-2.5 text-white bg-purple-500/80 backdrop-blur-sm rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 border border-purple-400/20"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
