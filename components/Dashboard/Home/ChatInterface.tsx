import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Loader2, X, Beef, Mic } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { useSpeechToText } from "../../../hooks/useSpeechToText";

interface ChatInterfaceProps {
  initialMessage: string;
  selectedModel: string;
  onClose: () => void;
  models: string[];
  setSelectedModel: (model: string) => void;
  onNewChat: () => void; // Add this prop
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
  onNewChat,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false); // Add this state
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isListening, startListening } = useSpeechToText();

  // Add this function to handle scrolling
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Update getAIResponse to handle errors better
  const getAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      if (data.response && data.response.trim()) {
        const aiMessage = {
          id: `ai-${Date.now()}`,
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: `ai-${Date.now()}`,
        text: "Sorry, I encountered an error processing your request.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect to prevent duplicate messages
  useEffect(() => {
    if (initialMessage.trim() && messages.length === 0) {
      const userMessage = {
        id: `user-${Date.now()}`,
        text: initialMessage,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      getAIResponse(initialMessage);
    }
  }, [initialMessage]);

  // Update the useEffect for messages to always scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update handleSubmit to scroll after adding user message
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
      scrollToBottom(); // Add this line
      await getAIResponse(inputValue);
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

  const handleSpeechInput = (text: string) => {
    setInputValue(text);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    onNewChat();
  };

  return (
    <div className="flex flex-col h-[100vh] overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-none border-b border-white/5 bg-black/30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Beef className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Vault AI Assistant
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
            >
              <span className="text-sm">New Chat</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
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

      {/* Fixed Input Area */}
      <div className="flex-none p-4 border-t border-white/5 bg-black/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening ? "Listening..." : "Type your message..."
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-4 pr-40 focus:outline-none focus:border-purple-500 placeholder-gray-500 text-sm backdrop-blur-sm text-white"
              disabled={isLoading || isListening}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => startListening(handleSpeechInput)}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? "bg-purple-500/20 text-purple-400 animate-pulse"
                    : "text-gray-400 hover:text-purple-400"
                }`}
                disabled={isLoading}
              >
                {isListening ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
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
