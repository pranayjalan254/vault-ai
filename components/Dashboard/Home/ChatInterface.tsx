import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Simulate AI response (replace with actual API call)
  const simulateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    // Simulate a delay for the AI response
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

  // Handle initial message
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

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Chat with AI</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-purple-400 transition-colors"
        >
          Close
        </button>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-purple-500 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs text-gray-300 block mt-1">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-3 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500 backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}