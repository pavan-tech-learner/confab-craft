import { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Send, User } from 'lucide-react';
import { ChatConfig } from '../../types/chat-config';

interface ChatWidgetProps {
  config: ChatConfig;
  className?: string;
}

export const ChatWidget = ({ config, className = "" }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(config.requireUserInfo);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.welcomeMessage,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Reset form when config changes
  useEffect(() => {
    setShowUserForm(config.requireUserInfo);
  }, [config.requireUserInfo]);

  const handleStartChat = () => {
    setShowUserForm(false);
    setMessages([
      {
        id: 1,
        text: config.welcomeMessage,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className={`cwb-chat-widget fixed ${getPositionClasses()} z-50 ${className}`}>
      {isOpen ? (
        <div 
          className="cwb-chat-window bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden"
          style={{ 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          }}
        >
          {/* Header */}
          <div 
            className="cwb-chat-header px-4 py-3 text-white flex items-center justify-between"
            style={{ backgroundColor: config.themeColor }}
          >
            <div className="cwb-header-content flex items-center space-x-3">
              {config.showAgentIcon && (
                <div className="cwb-agent-avatar w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
                  {config.companyLogo ? (
                    <img 
                      src={config.companyLogo} 
                      alt="Agent" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              <div className="cwb-header-text">
                <div className="cwb-company-name text-sm font-medium">
                  {config.companyName}
                </div>
                {config.showUserStatus && (
                  <div className="cwb-agent-status flex items-center text-xs opacity-90">
                    <div className="cwb-status-dot w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    {config.agentName} is online
                  </div>
                )}
              </div>
            </div>
            <div className="cwb-header-actions flex items-center space-x-2">
              <button className="cwb-minimize-btn text-white/80 hover:text-white transition-colors">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button 
                className="cwb-close-btn text-white/80 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="cwb-messages-area flex-1 p-4 overflow-y-auto bg-gray-50">
            {showUserForm ? (
              <div className="cwb-user-form space-y-4">
                <div 
                  className="cwb-welcome-bubble bg-white p-3 rounded-lg shadow-sm text-sm flex items-center gap-2"
                  style={{ borderLeft: `3px solid ${config.themeColor}` }}
                >
                  <span className="text-xl">👋</span>
                  <span style={{ color: config.themeColor }} className="font-medium">
                    Welcome!
                  </span>
                </div>
                <div className="cwb-form-message text-sm text-gray-600 mb-4">
                  {config.userInfoMessage}
                </div>
                
                {config.requiredFields.name && (
                  <div className="cwb-form-field">
                    <label className="cwb-field-label text-xs text-gray-600 mb-1 block">
                      Name *
                    </label>
                    <input 
                      type="text"
                      placeholder="Your name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        '--tw-ring-color': config.themeColor,
                        'focusRingColor': config.themeColor
                      } as React.CSSProperties}
                    />
                  </div>
                )}
                
                {config.requiredFields.email && (
                  <div className="cwb-form-field">
                    <label className="cwb-field-label text-xs text-gray-600 mb-1 block">
                      Email *
                    </label>
                    <input 
                      type="email"
                      placeholder="your@email.com"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        '--tw-ring-color': config.themeColor,
                        'focusRingColor': config.themeColor
                      } as React.CSSProperties}
                    />
                  </div>
                )}
                
                {config.requiredFields.phone && (
                  <div className="cwb-form-field">
                    <label className="cwb-field-label text-xs text-gray-600 mb-1 block">
                      Phone *
                    </label>
                    <input 
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        '--tw-ring-color': config.themeColor,
                        'focusRingColor': config.themeColor
                      } as React.CSSProperties}
                    />
                  </div>
                )}
                
                <button 
                  className="cwb-start-chat-btn w-full py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: config.themeColor }}
                  onClick={handleStartChat}
                >
                  Start Chat
                </button>
              </div>
            ) : (
              <div className="cwb-messages-list space-y-3">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`cwb-message flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`cwb-message-bubble max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        message.isUser 
                          ? 'text-white' 
                          : 'bg-white text-gray-800 shadow-sm'
                      }`}
                      style={message.isUser ? { backgroundColor: config.themeColor } : {}}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          {!showUserForm && (
            <div className="cwb-input-area p-4 border-t border-gray-100">
              <div className="cwb-input-container flex items-center space-x-2">
                <input 
                  type="text"
                  placeholder="Type your message..."
                  className="cwb-message-input flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    '--tw-ring-color': config.themeColor,
                    'focusRingColor': config.themeColor
                  } as React.CSSProperties}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleSendMessage(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button 
                  className="cwb-send-btn w-8 h-8 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: config.themeColor }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button 
          className="cwb-chat-bubble w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
          style={{ backgroundColor: config.themeColor }}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};