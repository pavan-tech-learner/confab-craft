import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X, Send, MessageCircle, Minimize2, Check, CheckCheck, Clock, Sparkles } from 'lucide-react';
import { ChatConfig, ChatMessage, UserStatus } from '../types/chat-config';
import { hexToRgb, adjustColor } from '../lib/utils';

// Floating particles component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

interface ChatWidgetProps {
  config: ChatConfig;
  apiBaseUrl: string;
  sellerId: string;
  widgetId: string;
  initialMessages?: ChatMessage[];
  isPreview?: boolean;
}

// User info form component
const UserInfoForm = ({ config, onSubmit }: { 
  config: ChatConfig; 
  onSubmit: (userInfo: { name?: string; email?: string; phone?: string }) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-4 space-y-4">
      <div
        className="welcome-bubble bg-white p-3 rounded-lg shadow-sm text-sm flex items-center gap-2"
        style={{ borderLeft: `3px solid ${config.themeColor}` }}
      >
        <span className="text-xl">👋</span>
        <span style={{ color: config.themeColor }} className="font-medium">
          Welcome!
        </span>
      </div>
      <div className="form-message text-sm text-gray-600 mb-4">
        {config.userInfoMessage}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.requiredFields.name && (
          <div className="form-field">
            <label className="field-label text-xs text-gray-600 mb-1 block">
              Name *
            </label>
            <Input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="form-input text-sm"
            />
          </div>
        )}

        {config.requiredFields.email && (
          <div className="form-field">
            <label className="field-label text-xs text-gray-600 mb-1 block">
              Email *
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="form-input text-sm"
            />
          </div>
        )}

        {config.requiredFields.phone && (
          <div className="form-field">
            <label className="field-label text-xs text-gray-600 mb-1 block">
              Phone *
            </label>
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
              className="form-input text-sm"
            />
          </div>
        )}

        <Button
          type="submit"
          className="start-chat-btn w-full text-sm"
          style={{ backgroundColor: config.themeColor }}
        >
          Start Chat
        </Button>
      </form>
    </div>
  );
};

export const SimpleChatWidget: React.FC<ChatWidgetProps> = ({
  config,
  apiBaseUrl,
  sellerId,
  widgetId,
  initialMessages = [],
  isPreview = false
}) => {
  const [isOpen, setIsOpen] = useState(isPreview);
  const [showUserForm, setShowUserForm] = useState(config.requireUserInfo);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (config.requireUserInfo) {
      return [];
    }
    return initialMessages.length > 0 ? initialMessages : [
      {
        id: 'welcome',
        text: config.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        status: 'delivered'
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [connectionType, setConnectionType] = useState<'websocket' | 'rest' | 'none'>('none');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Simple WebSocket connection attempt
  const tryWebSocketConnection = () => {
    try {
      const wsUrl = `ws://${apiBaseUrl.replace('http://', '').replace('https://', '')}/ws?sellerId=${sellerId}&widgetId=${widgetId}`;
      console.log('Trying WebSocket connection:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setConnectionType('websocket');
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            const newMessage: ChatMessage = {
              id: data.id || Date.now().toString(),
              text: data.message,
              isUser: false,
              timestamp: new Date(),
              status: 'delivered'
            };
            setMessages(prev => [...prev, newMessage]);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed, falling back to REST');
        setConnectionType('rest');
      };
      
      wsRef.current.onerror = () => {
        console.log('WebSocket connection failed, using REST API');
        setConnectionType('rest');
      };
      
    } catch (error) {
      console.log('WebSocket not available, using REST API');
      setConnectionType('rest');
    }
  };

  // Send message function - tries WebSocket first, then REST
  const sendMessage = async (message: string) => {
    // Try WebSocket first
    if (connectionType === 'websocket' && wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({
          type: 'message',
          message,
          sellerId,
          widgetId,
          userInfo,
          timestamp: new Date().toISOString()
        }));
        console.log('Message sent via WebSocket');
        return true;
      } catch (error) {
        console.log('WebSocket send failed, trying REST API');
      }
    }
    
    // Fallback to REST API
    try {
      const response = await fetch(`${apiBaseUrl}/sendmessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId,
          widgetId,
          message,
          userInfo,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('Message sent via REST API');
        
        // Simulate agent response for REST API
        setTimeout(() => {
          const responses = [
            "Thanks for reaching out! I'm here to help you. ✨",
            "Great question! Let me get you the perfect solution. 🚀",
            "I'd be happy to assist you with that! 💫",
            "Absolutely! I'm on it right away. 🌟"
          ];
          
          const agentResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: responses[Math.floor(Math.random() * responses.length)],
            isUser: false,
            timestamp: new Date(),
            status: 'delivered'
          };
          setMessages(prev => [...prev, agentResponse]);
          setIsTyping(false);
        }, 2000);
        
        return true;
      }
    } catch (error) {
      console.error('REST API send failed:', error);
    }
    
    return false;
  };

  const handleUserInfoSubmit = (userInfoData: any) => {
    setUserInfo(userInfoData);
    setShowUserForm(false);
    
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        text: config.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        status: 'delivered'
      }
    ]);
    
    // Try to establish WebSocket connection
    tryWebSocketConnection();
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    
    // If user info not required, try WebSocket connection immediately
    if (!config.requireUserInfo) {
      tryWebSocketConnection();
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    const messageText = inputValue;
    setInputValue('');

    // Update to delivered
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);

    // Send message
    setIsTyping(true);
    const success = await sendMessage(messageText);

    if (success) {
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'seen' } : msg
        ));
      }, 1000);
    } else {
      // Show error message
      setTimeout(() => {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: config.fallbackMessage,
          isUser: false,
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6'
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(100%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .message-enter {
          animation: messageSlideIn 0.4s ease-out forwards;
        }

        .chat-button-pulse {
          animation: buttonPulse 2s infinite;
        }

        .chat-window-enter {
          animation: slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }

        .glass-effect {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Ensure consistent floating design */
        .chat-window {
          border-radius: 1.5rem;
        }

        @media (max-width: 640px) {
          .chat-window {
            border-radius: 1rem;
          }
        }
      `}</style>

      <div
        className={`fixed z-50 font-sans transition-all duration-500 ${positionClasses[config.position]}`}
        style={{
          '--widget-primary': config.themeColor,
          '--widget-primary-rgb': hexToRgb(config.themeColor)
        } as React.CSSProperties}
      >
      {/* Responsive Chat Button */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={handleOpenChat}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-300
              hover:scale-110 hover:shadow-3xl border-0 text-white relative overflow-hidden
              flex items-center justify-center cursor-pointer
              ${showWelcomeAnimation ? 'chat-button-pulse' : ''}
            `}
            style={{
              background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`,
              boxShadow: `0 10px 40px ${config.themeColor}40`
            }}
          >
            <div className="shimmer-bg absolute inset-0 rounded-full" />
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 relative z-10" />

            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce">
              1
            </div>
          </button>

          {/* Floating ring animation */}
          <div
            className="absolute inset-0 rounded-full border-2 animate-ping opacity-30 pointer-events-none"
            style={{ borderColor: config.themeColor }}
          />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-72 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[520px] lg:w-[420px] lg:h-[580px] glass-effect rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden chat-window-enter chat-window">
          {/* Enhanced Header */}
          <div
            className="relative p-3 sm:p-4 md:p-5 text-white flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 30)} 100%)`
            }}
          >
            <FloatingParticles />

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative z-10 min-w-0 flex-1">
              {config.logo && (
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full p-0.5 flex-shrink-0"
                  style={{
                    background: `linear-gradient(45deg, ${config.themeColor}, ${adjustColor(config.themeColor, 40)})`
                  }}
                >
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <img
                      src={config.logo}
                      alt="Logo"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">{config.companyName}</h3>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm opacity-90">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>{config.agentName} is online</span>
                  <span className="opacity-60">• {connectionType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 relative z-10">
              <button
                onClick={handleCloseChat}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 chat-messages">
            {showUserForm ? (
              <UserInfoForm config={config} onSubmit={handleUserInfoSubmit} />
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex message-enter ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Agent Icon */}
                      {!message.isUser && config.showAgentIcon && (
                        <div className="flex-shrink-0">
                          {config.logo ? (
                            <div
                              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full p-0.5"
                              style={{
                                background: `linear-gradient(45deg, ${config.themeColor}, ${adjustColor(config.themeColor, 40)})`
                              }}
                            >
                              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                <img
                                  src={config.logo}
                                  alt="Agent"
                                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full object-cover"
                                />
                              </div>
                            </div>
                          ) : (
                            <div
                              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                              }}
                            >
                              {config.agentName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
                        <div
                          className={`
                            p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl text-xs sm:text-sm break-words shadow-lg transition-all duration-200 hover:shadow-xl
                            ${message.isUser
                              ? 'text-white rounded-br-lg transform hover:scale-[1.02]'
                              : 'bg-white border border-gray-100 rounded-bl-lg shadow-md hover:shadow-lg'
                            }
                          `}
                          style={message.isUser ? {
                            background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                          } : {}}
                        >
                          {message.text}
                        </div>

                        {/* Message Status */}
                        {config.showMessageStatus && message.isUser && message.status && (
                          <div className="flex items-center justify-end gap-1 sm:gap-2 text-xs text-gray-500">
                            {message.status === 'sending' && (
                              <>
                                <Clock className="w-2 h-2 sm:w-3 sm:h-3 animate-spin" />
                                <span>Sending</span>
                              </>
                            )}
                            {message.status === 'delivered' && (
                              <>
                                <Check className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
                                <span className="text-green-600">Delivered</span>
                              </>
                            )}
                            {message.status === 'seen' && (
                              <>
                                <CheckCheck className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
                                <span className="text-blue-600 font-medium">Seen</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          {!showUserForm && (
            <div className="p-4 bg-white border-t border-gray-100 input-area">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: config.themeColor }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default SimpleChatWidget;
