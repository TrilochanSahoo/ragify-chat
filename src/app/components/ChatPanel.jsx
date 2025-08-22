"use client"
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Upload, Bot, User, Palette, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";

const themes = [
  { 
    id: 'lavender', 
    name: 'Lavender Dream', 
    icon: '💜',
    colors: {
      primary: '260 60% 65%',
      secondary: '160 50% 70%',
      accent: '340 60% 75%',
      gradientPrimary: 'linear-gradient(135deg, hsl(260 60% 65%) 0%, hsl(280 55% 70%) 100%)',
      gradientAccent: 'linear-gradient(135deg, hsl(340 60% 75%) 0%, hsl(320 55% 70%) 100%)',
      chatUser: '260 60% 65%',
      chatAssistant: '245 15% 16%'
    }
  },
  { 
    id: 'ocean', 
    name: 'Ocean Breeze', 
    icon: '🌊',
    colors: {
      primary: '200 70% 60%',
      secondary: '180 50% 70%',
      accent: '220 60% 75%',
      gradientPrimary: 'linear-gradient(135deg, hsl(200 70% 60%) 0%, hsl(220 65% 65%) 100%)',
      gradientAccent: 'linear-gradient(135deg, hsl(220 60% 75%) 0%, hsl(200 55% 70%) 100%)',
      chatUser: '200 70% 60%',
      chatAssistant: '220 20% 16%'
    }
  },
  { 
    id: 'sunset', 
    name: 'Sunset Glow', 
    icon: '🌅',
    colors: {
      primary: '20 70% 65%',
      secondary: '340 50% 70%',
      accent: '10 60% 75%',
      gradientPrimary: 'linear-gradient(135deg, hsl(20 70% 65%) 0%, hsl(340 65% 70%) 100%)',
      gradientAccent: 'linear-gradient(135deg, hsl(10 60% 75%) 0%, hsl(30 55% 70%) 100%)',
      chatUser: '20 70% 65%',
      chatAssistant: '10 20% 16%'
    }
  },
  { 
    id: 'forest', 
    name: 'Forest Mist', 
    icon: '🌿',
    colors: {
      primary: '120 50% 60%',
      secondary: '80 45% 65%',
      accent: '140 55% 70%',
      gradientPrimary: 'linear-gradient(135deg, hsl(120 50% 60%) 0%, hsl(140 55% 65%) 100%)',
      gradientAccent: 'linear-gradient(135deg, hsl(140 55% 70%) 0%, hsl(80 50% 65%) 100%)',
      chatUser: '120 50% 60%',
      chatAssistant: '120 20% 16%'
    }
  },
  { 
    id: 'rose', 
    name: 'Rose Garden', 
    icon: '🌸',
    colors: {
      primary: '320 55% 65%',
      secondary: '300 50% 70%',
      accent: '340 60% 75%',
      gradientPrimary: 'linear-gradient(135deg, hsl(320 55% 65%) 0%, hsl(300 60% 70%) 100%)',
      gradientAccent: 'linear-gradient(135deg, hsl(340 60% 75%) 0%, hsl(320 55% 70%) 100%)',
      chatUser: '320 55% 65%',
      chatAssistant: '320 20% 16%'
    }
  }
];

export function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Apply theme colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', currentTheme.colors.primary);
    root.style.setProperty('--secondary', currentTheme.colors.secondary);
    root.style.setProperty('--accent', currentTheme.colors.accent);
    root.style.setProperty('--gradient-primary', currentTheme.colors.gradientPrimary);
    root.style.setProperty('--gradient-accent', currentTheme.colors.gradientAccent);
    root.style.setProperty('--chat-message-user', currentTheme.colors.chatUser);
    root.style.setProperty('--chat-message-assistant', currentTheme.colors.chatAssistant);
  }, [currentTheme]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: Math.random().toString(36).substr(2, 9),
        content: "I understand your question! I'll help you analyze your sources and provide insights based on the information you've uploaded. Could you provide more context about what specific aspect you'd like me to focus on?",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full bg-[hsl(var(--chat-background))] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Chat</h2>
            <p className="text-sm text-muted-foreground">Ask questions about your sources</p>
          </div>
          
          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {themes.map((theme) => (
                <DropdownMenuItem
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{theme.icon}</span>
                    <span className="text-sm">{theme.name}</span>
                  </div>
                  {currentTheme.id === theme.id && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="bg-[var(--gradient-primary)] p-8 rounded-3xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative flex items-center justify-center">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Bot className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Untitled notebook</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Upload sources to get started. You can add documents, notes, and web links to create your research notebook.
            </p>
            <Button 
              variant="outline" 
              className="mt-4 border-primary/20 hover:bg-primary/10"
              onClick={() => {
                const sourcesPanel = document.querySelector('[data-panel="sources"]');
                sourcesPanel?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Add your first source
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  <MessageBubble message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-gradient-card">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your sources..."
            className="flex-1 bg-input border-border focus:ring-primary"
            disabled={isTyping}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-[var(--gradient-primary)] text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {messages.length === 0 ? "0 sources" : `${messages.length} messages`} • Press Enter to send
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 bg-[var(--gradient-primary)]">
          <AvatarFallback className="bg-transparent text-primary-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <Card className={`
        max-w-[80%] p-3 
        ${isUser 
          ? 'bg-[hsl(var(--chat-message-user))] text-primary-foreground' 
          : 'bg-[hsl(var(--chat-message-assistant))] text-foreground'
        }
        border-border
      `}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-2 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </Card>
      
      {isUser && (
        <Avatar className="w-8 h-8 bg-gradient-accent">
          <AvatarFallback className="bg-transparent text-accent-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="w-8 h-8 bg-[var(--gradient-primary)]">
        <AvatarFallback className="bg-transparent text-primary-foreground">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      
      <Card className="p-3 bg-[hsl(var(--chat-message-assistant))] border-border">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-muted-foreground rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}