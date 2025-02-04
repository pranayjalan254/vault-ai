import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, ChevronDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessage: string;
  selectedModel: string;
  models: string[];
  onClose: () => void;
  setSelectedModel: (model: string) => void;
}

export function ChatInterface({
  initialMessage,
  selectedModel,
  models,
  onClose,
  setSelectedModel,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: initialMessage,
      sender: "user",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `AI response to: "${newMessage}"`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900/20">
      <div className="border-b border-gray-800 bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
            <h2 className="text-lg font-medium text-gray-200">
              Vault AI Assistant
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto">
          <div className="space-y-6 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl p-4 max-w-[85%] ${
                    message.sender === "user"
                      ? "bg-purple-500/20 text-white"
                      : "bg-gray-800/40 text-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Popover.Root>
              <Popover.Trigger className="px-3 py-2 bg-gray-800/40 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                {selectedModel}
                <ChevronDown className="h-4 w-4" />
              </Popover.Trigger>
              <Popover.Content className="bg-gray-900 border border-gray-800 rounded-lg p-1 shadow-xl">
                <div className="py-1">
                  {models.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className="w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg text-left"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </Popover.Content>
            </Popover.Root>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message Vault AI..."
              className="flex-1 bg-gray-800/40 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500 text-sm"
            />
            <button
              type="submit"
              className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
