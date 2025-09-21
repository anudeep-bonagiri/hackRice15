import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Mascot } from '@/components/Mascot';
import { geminiChatService, ChatMessage } from '@/services/geminiService';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: "Ribbit! Hi there! 🐸 I'm Lizard the Frog, your GrowFi guide! I evolved from a tiny tadpole by learning about money - just like you'll grow your wealth! Let's hop into some financial wisdom together. What would you like to learn about budgeting, saving, or investing today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await geminiChatService.sendMessage(inputMessage);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    setInputMessage(prompt);
    // Small delay to show the text in input, then send
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    geminiChatService.resetChat();
    setMessages([]);
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: "Ribbit! Hi there! 🐸 I'm Lizard the Frog, your GrowFi guide! I evolved from a tiny tadpole by learning about money - just like you'll grow your wealth! Let's hop into some financial wisdom together. What would you like to learn about budgeting, saving, or investing today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg z-40 p-2"
          size="icon"
        >
          <div className="relative">
            <Mascot level={5} points={400} size="sm" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="h-1.5 w-1.5 text-green-800" />
            </span>
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-96 h-[600px] max-h-[80vh] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-1">
                  <Mascot level={5} points={400} size="sm" />
                </div>
                <div>
                  <CardTitle className="text-lg">Lizard the Frog 🐸</CardTitle>
                  <p className="text-xs text-green-100">Your GrowFi Guide</p>
                  <p className="text-xs text-green-200 opacity-80">Powered by Google Gemini</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetChat}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <ScrollArea className="flex-1 h-0">
              <div className="p-4 space-y-4 min-h-full">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 border-t bg-gray-50 flex-shrink-0">
                <p className="text-xs text-gray-600 mb-2">Quick start topics:</p>
                <div className="flex flex-wrap gap-1">
                  {geminiChatService.getQuickStartPrompts().slice(0, 4).map((prompt) => (
                    <Badge
                      key={prompt}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100 text-xs"
                      onClick={() => handleQuickPrompt(prompt)}
                    >
                      {prompt}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t bg-white flex-shrink-0">
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Lizard about money, budgets, investing... 🐸"
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Professional Footer */}
              <div className="px-4 py-2 bg-gray-50 border-t text-center">
                <p className="text-xs text-gray-500">
                  ⚡ Powered by <span className="font-semibold text-blue-600">Google Gemini</span> • 🌱 Built for <span className="font-semibold text-green-600">HackRice 2025</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBot;