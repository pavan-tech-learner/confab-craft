import { MessageCircle, MessageSquare, Phone, Headphones, HelpCircle, Mail, X, Minimize2, Send, User } from 'lucide-react';
import { ChatConfig } from '../../types/chat-config';
import { useState, useEffect } from 'react';

interface ChatPreviewProps {
  config: ChatConfig;
  title?: string;
  subtitle?: string;
}

export const ChatPreview = ({
  config,
  title = "Live Preview",
  subtitle = "See your branding changes"
}: ChatPreviewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showUserForm, setShowUserForm] = useState(config.requireUserInfo);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.welcomeMessage,
      isUser: false,
      timestamp: new Date()
    }
  ]);

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

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: messages.length + 2,
        text: "Thanks for your message! Our team will get back to you shortly.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  const getChatIcon = () => {
    switch (config.chatIcon || 'message-circle') {
      case 'message-square':
        return MessageSquare;
      case 'phone':
        return Phone;
      case 'headphones':
        return Headphones;
      case 'help-circle':
        return HelpCircle;
      case 'mail':
        return Mail;
      default:
        return MessageCircle;
    }
  };

  const ChatIcon = getChatIcon();

  return (
    <div className="cwb-preview-container bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
      {/* Header */}
      <div className="cwb-preview-header mb-6 text-center">
        <h3 className="cwb-preview-title text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="cwb-preview-subtitle text-sm text-gray-600">
          {subtitle}
        </p>
      </div>

      {/* Enhanced Preview Area - Simulated Website Environment */}
      <div className="cwb-preview-area bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 min-h-[600px] relative overflow-hidden">
        {/* Simulated Website Background */}
        <div className="cwb-mock-website absolute inset-0 p-8">
          {/* Mock Website Header */}
          <div className="cwb-mock-header mb-8">
            <div className="flex items-center justify-between">
              <div className="cwb-mock-logo h-8 w-32 bg-white/60 rounded"></div>
              <div className="cwb-mock-nav flex space-x-4">
                <div className="h-4 w-16 bg-white/40 rounded"></div>
                <div className="h-4 w-20 bg-white/40 rounded"></div>
                <div className="h-4 w-16 bg-white/40 rounded"></div>
              </div>
            </div>
          </div>

          {/* Mock Website Content */}
          <div className="cwb-mock-content max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="cwb-mock-title h-8 bg-white/60 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="cwb-mock-text h-4 bg-white/40 rounded w-full"></div>
                <div className="cwb-mock-text h-4 bg-white/40 rounded w-4/5"></div>
                <div className="cwb-mock-text h-4 bg-white/40 rounded w-3/4"></div>
              </div>

              {/* Mock Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="cwb-mock-card bg-white/80 p-6 rounded-lg shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-100 rounded"></div>
                      <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Widget */}
        <div className={`cwb-widget-container absolute z-10 ${isOpen ? 'inset-0 flex items-center justify-center' : 'bottom-4 right-4'}`}>
          {isOpen ? (
            <div
              className="cwb-chat-window bg-white rounded-2xl shadow-2xl w-[430px] max-w-[95%] mx-auto h-[500px] flex flex-col overflow-hidden"
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
                <div className="cwb-header-actions flex items-center">
  <button
    className="cwb-close-btn text-white/80 hover:text-white transition-colors"
    onClick={() => setIsOpen(false)}
    aria-label="Close"
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
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleSendMessage(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="cwb-closed-widget relative">
              {/* Chat Prompt Message */}
              {(config.showChatPrompt !== false) && (
                <div className="cwb-chat-prompt absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 border max-w-[250px] mb-2">
                  <div className="text-sm text-gray-700">{config.chatPromptMessage || 'Hi there, have a question? Text us here.'}</div>
                  <button
                    className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      // In a real implementation, this would hide the prompt
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-3 h-3 bg-white border-l border-b transform rotate-45"></div>
                  </div>
                </div>
              )}

              {/* Chat Bubble */}
              <button
                className="cwb-chat-bubble w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
                style={{ backgroundColor: config.themeColor }}
                onClick={() => setIsOpen(true)}
              >
                <ChatIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};
