import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello, I am Lizard the Frog! How can I help you with your financial literacy journey today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Add the new user message
      conversationHistory.push({ role: 'user', content: userMessage.text });

      // Call backend proxy to OpenRouter (keeps API key server-side)
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/chat/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory,
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            content ||
            "I'm here to help with your financial questions! Could you please rephrase that?",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        let detail = '';
        try {
          const errBody = await response.json();
          detail = errBody?.error || errBody?.details || '';
        } catch {}
        throw new Error(`AI request failed ${detail ? `- ${detail}` : ''}`);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const friendly =
        error instanceof Error && error.message
          ? `Sorry — ${error.message}. Please try again shortly.`
          : "I'm having trouble connecting to the AI assistant right now. Please try again in a moment, or feel free to explore the modules for immediate help!";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: friendly,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-28 right-0 animate-in slide-in-from-bottom-2 duration-300">
          <Card className="w-80 h-96 bg-white shadow-2xl border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Lizard the Frog
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-full">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'bot' && (
                            <Bot className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          )}
                          {message.sender === 'user' && (
                            <User className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="whitespace-pre-wrap">{message.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Bot className="w-3 h-3" />
                          <div className="flex space-x-1">
                            <div
                              className="w-1 h-1 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: '0ms' }}
                            ></div>
                            <div
                              className="w-1 h-1 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: '150ms' }}
                            ></div>
                            <div
                              className="w-1 h-1 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: '300ms' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about financial literacy..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading} size="sm" className="btn-primary">
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-muted-foreground hover:bg-muted-foreground/90' : 'bg-primary hover:bg-primary/90 hover:scale-110'
        }`}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default ChatBot;
