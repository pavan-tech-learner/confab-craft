import { MessageCircle, MessageSquare, Phone, Headphones, HelpCircle, Mail, X, Minimize2, Send, User, Check, CheckCheck, Clock } from 'lucide-react';
import { ChatConfig } from '../../types/chat-config';
import { useState, useEffect, useRef } from 'react';

interface ChatPreviewProps {
  config: ChatConfig;
  title?: string;
  subtitle?: string;
}

// Floating particles component for header animation
const FloatingParticles = () => (
  <div className="cwb-floating-particles absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="cwb-particle absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
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

// Utility function to adjust color brightness
const adjustColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

export const ChatPreview = ({
  config,
  title = "Live Preview",
  subtitle = "See your branding changes"
}: ChatPreviewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showUserForm, setShowUserForm] = useState(config.requireUserInfo);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
      status: 'delivered'
    }
  ]);

  // Update welcome message when config changes
  useEffect(() => {
    setMessages(prev => prev.map(msg =>
      msg.id === 1 ? { ...msg, text: config.welcomeMessage } : msg
    ));
  }, [config.welcomeMessage]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset form when config changes
  useEffect(() => {
    setShowUserForm(config.requireUserInfo);
  }, [config.requireUserInfo]);

  // Welcome animation timer
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartChat = () => {
    setShowUserForm(false);
    setMessages([
      {
        id: 1,
        text: config.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        status: 'delivered'
      }
    ]);
  };

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };
    setMessages(prev => [...prev, newMessage]);

    // Update to delivered
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);

    // Show typing indicator and simulate agent response
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'seen' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! I'm here to help you. ✨",
        "Great question! Let me get you the perfect solution. 🚀",
        "I'd be happy to assist you with that! 💫",
        "Absolutely! I'm on it right away. 🌟"
      ];

      const agentResponse = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 2000);
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
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes cwb-typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes cwb-messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cwb-buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes cwb-shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }

        @keyframes cwb-slideInUp {
          from {
            transform: translateY(100%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes cwb-glow {
          0%, 100% {
            box-shadow: 0 0 20px ${config.themeColor}40, 0 0 40px ${config.themeColor}20, 0 0 60px ${config.themeColor}10;
          }
          50% {
            box-shadow: 0 0 30px ${config.themeColor}60, 0 0 60px ${config.themeColor}40, 0 0 90px ${config.themeColor}20;
          }
        }

        .cwb-message-enter {
          animation: cwb-messageSlideIn 0.4s ease-out forwards;
        }

        .cwb-chat-button-pulse {
          animation: cwb-buttonPulse 2s infinite, cwb-glow 3s ease-in-out infinite;
        }

        .cwb-chat-window-enter {
          animation: cwb-slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .cwb-shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200px 100%;
          animation: cwb-shimmer 2s infinite;
        }

        .cwb-glass-effect {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.98);
        }

        /* Custom utility classes with cwb- prefix */
        .cwb-relative { position: relative; }
        .cwb-absolute { position: absolute; }
        .cwb-bottom-full { bottom: 100%; }
        .cwb-right-0 { right: 0; }
        .cwb-mb-3 { margin-bottom: 0.75rem; }
        .cwb-bg-white { background-color: white; }
        .cwb-rounded-lg { border-radius: 0.5rem; }
        .cwb-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .cwb-p-3 { padding: 0.75rem; }
        .cwb-border { border-width: 1px; border-color: #e5e7eb; }
        .cwb-max-w-xs { max-width: 20rem; }
        .cwb-min-w-48 { min-width: 12rem; }
        .cwb-text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .cwb-text-gray-700 { color: #374151; }
        .cwb-pr-6 { padding-right: 1.5rem; }
        .cwb-top-1 { top: 0.25rem; }
        .cwb-right-1 { right: 0.25rem; }
        .cwb-text-gray-400 { color: #9ca3af; }
        .cwb-transition-colors { transition: color 0.15s ease-in-out; }
        .cwb-w-3 { width: 0.75rem; }
        .cwb-h-3 { height: 0.75rem; }
        .cwb-w-14 { width: 3.5rem; }
        .cwb-h-14 { height: 3.5rem; }
        .cwb-rounded-full { border-radius: 9999px; }
        .cwb-shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .cwb-transition-all { transition: all 0.15s ease-in-out; }
        .cwb-duration-300 { transition-duration: 0.3s; }
        .cwb-border-0 { border-width: 0; }
        .cwb-text-white { color: white; }
        .cwb-overflow-hidden { overflow: hidden; }
        .cwb-flex { display: flex; }
        .cwb-items-center { align-items: center; }
        .cwb-justify-center { justify-content: center; }
        .cwb-cursor-pointer { cursor: pointer; }
        .cwb-inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .cwb-z-10 { z-index: 10; }
        .cwb-w-6 { width: 1.5rem; }
        .cwb-h-6 { height: 1.5rem; }
        .cwb--top-1 { top: -0.25rem; }
        .cwb--right-1 { right: -0.25rem; }
        .cwb-w-5 { width: 1.25rem; }
        .cwb-h-5 { height: 1.25rem; }
        .cwb-bg-red-500 { background-color: #ef4444; }
        .cwb-text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cwb-font-bold { font-weight: 700; }
        .cwb-animate-bounce { animation: bounce 1s infinite; }
        .cwb-border-2 { border-width: 2px; }
        .cwb-animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .cwb-opacity-30 { opacity: 0.3; }
        .cwb-pointer-events-none { pointer-events: none; }
        .cwb-p-4 { padding: 1rem; }
        .cwb-border-t { border-top-width: 1px; }
        .cwb-border-gray-100 { border-color: #f3f4f6; }
        .cwb-space-x-2 > * + * { margin-left: 0.5rem; }
        .cwb-flex-1 { flex: 1 1 0%; }
        .cwb-px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .cwb-py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .cwb-border-gray-200 { border-color: #e5e7eb; }
        .cwb-w-10 { width: 2.5rem; }
        .cwb-h-10 { height: 2.5rem; }
        .cwb-w-4 { width: 1rem; }
        .cwb-h-4 { height: 1rem; }
        .cwb-w-8 { width: 2rem; }
        .cwb-h-8 { height: 2rem; }
        .cwb-bg-black { background-color: black; }
        .cwb-bg-opacity-20 { background-color: rgba(0, 0, 0, 0.2); }
        .cwb-bg-opacity-30 { background-color: rgba(0, 0, 0, 0.3); }
        .cwb-bg-transparent { background-color: transparent; }
        .cwb-bg-gray-50 { background-color: #f9fafb; }
        .cwb-bg-gray-600 { background-color: #4b5563; }
        .cwb-placeholder-gray-500::placeholder { color: #6b7280; }
        .cwb-ml-2 { margin-left: 0.5rem; }
        .cwb-border-black { border-color: #000000; }
        .cwb-stroke-2 { stroke-width: 2; }
        .cwb-transition-colors { transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out; }
        .focus-within\:cwb-border-black:focus-within { border-color: #000000; }
        .cwb-max-w-85 { max-width: 85%; }
        .cwb-w-6 { width: 1.5rem; }
        .cwb-h-6 { height: 1.5rem; }
        .cwb-gap-2 { gap: 0.5rem; }
        .cwb-flex-shrink-0 { flex-shrink: 0; }
        .cwb-p-0\.5 { padding: 0.125rem; }
        .cwb-text-xs { font-size: 0.75rem; }
        .cwb-text-sm { font-size: 0.875rem; }
        .cwb-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .cwb-shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .cwb-border-gray-100 { border-color: #f3f4f6; }
        .cwb-space-x-1 > * + * { margin-left: 0.25rem; }
        .cwb-w-2 { width: 0.5rem; }
        .cwb-h-2 { height: 0.5rem; }
        .cwb-animate-bounce { animation: bounce 1s infinite; }

        /* Hover states */
        .cwb-chat-bubble:hover { transform: scale(1.1); }
        .cwb-send-btn:hover { opacity: 0.9; }
        .cwb-text-gray-400:hover { color: #6b7280; }
        .cwb-bg-opacity-20:hover { background-color: rgba(0, 0, 0, 0.2); }
        .cwb-bg-opacity-30:hover { background-color: rgba(0, 0, 0, 0.3); }

        /* Focus states */
        .cwb-message-input:focus { outline: none; ring: 2px; ring-opacity: 0.5; }
      `}</style>
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
          {!isOpen && (
            <div className="cwb-closed-widget cwb-relative">
              {/* Chat Prompt Message */}
              {config.showChatPrompt && (
                <div className="cwb-chat-prompt cwb-absolute cwb-bottom-full cwb-right-0 cwb-mb-3 cwb-bg-white cwb-rounded-lg cwb-shadow-lg cwb-p-3 cwb-border cwb-max-w-xs cwb-min-w-48">
                  <div className="cwb-text-sm cwb-text-gray-700 cwb-pr-6">{config.chatPromptMessage || 'Hi there, have a question? Text us here.'}</div>
                  <button
                    className="cwb-absolute cwb-top-1 cwb-right-1 cwb-text-gray-400 hover:cwb-text-gray-600 cwb-transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <X className="cwb-w-3 cwb-h-3" />
                  </button>
                  {/* Speech bubble tail */}
                  <div className="cwb-absolute cwb-top-full cwb-right-4 cwb-w-0 cwb-h-0"
                       style={{
                         borderLeft: '8px solid transparent',
                         borderRight: '8px solid transparent',
                         borderTop: '8px solid white'
                       }}>
                  </div>
                </div>
              )}

              {/* Enhanced Chat Button */}
              <button
                className={`
                  cwb-chat-bubble cwb-w-14 cwb-h-14 cwb-rounded-full cwb-shadow-2xl cwb-transition-all cwb-duration-300
                  hover:cwb-scale-110 hover:cwb-shadow-3xl cwb-border-0 cwb-text-white cwb-relative cwb-overflow-hidden
                  cwb-flex cwb-items-center cwb-justify-center cwb-cursor-pointer
                  ${showWelcomeAnimation ? 'cwb-chat-button-pulse' : ''}
                `}
                style={{
                  background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`,
                  boxShadow: `0 10px 40px ${config.themeColor}40`
                }}
                onClick={() => setIsOpen(true)}
              >
                <div className="cwb-shimmer-bg cwb-absolute cwb-inset-0 cwb-rounded-full" />
                <ChatIcon className="cwb-w-6 cwb-h-6 cwb-relative cwb-z-10" />

                {/* Notification badge */}
                <div className="cwb-absolute cwb--top-1 cwb--right-1 cwb-w-5 cwb-h-5 cwb-bg-red-500 cwb-rounded-full cwb-flex cwb-items-center cwb-justify-center cwb-text-xs cwb-text-white cwb-font-bold cwb-animate-bounce">
                  1
                </div>
              </button>

              {/* Floating ring animation */}
              <div
                className="cwb-absolute cwb-inset-0 cwb-rounded-full cwb-border-2 cwb-animate-ping cwb-opacity-30 cwb-pointer-events-none"
                style={{ borderColor: config.themeColor }}
              />
            </div>
          )}

          {isOpen && (
            <div className="cwb-chat-window cwb-glass-effect rounded-2xl shadow-2xl w-[430px] max-w-[95%] mx-auto h-[500px] flex flex-col overflow-hidden cwb-chat-window-enter">
              {/* Enhanced Header */}
              <div
                className="cwb-chat-header relative p-4 text-white flex items-center justify-between rounded-t-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 30)} 100%)`
                }}
              >
                <FloatingParticles />

                <div className="cwb-header-content flex items-center gap-3 relative z-10 min-w-0 flex-1">
                  {config.showAgentIcon && (
                    <div className="cwb-agent-avatar flex-shrink-0">
                      {config.companyLogo ? (
                        <div
                          className="w-10 h-10 rounded-full p-0.5"
                          style={{
                            background: `linear-gradient(45deg, ${config.themeColor}, ${adjustColor(config.themeColor, 40)})`
                          }}
                        >
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                            <img
                              src={config.companyLogo}
                              alt="Agent"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                          }}
                        >
                          {config.agentName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="cwb-header-text min-w-0 flex-1">
                    <div className="cwb-company-name font-bold text-base truncate">
                      {config.companyName}
                    </div>
                    {config.showUserStatus && (
                      <div className="cwb-agent-status flex items-center text-sm opacity-90">
                        <div className="cwb-status-dot w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                        <span>{config.agentName} is online</span>
                        <span className="opacity-60 ml-1">• Live</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="cwb-header-actions flex items-center relative z-10">
                  <button
                    className="cwb-close-btn p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="cwb-messages-area flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`cwb-message flex cwb-message-enter ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className={`flex gap-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Agent Icon */}
                          {!message.isUser && config.showAgentIcon && (
                            <div className="flex-shrink-0">
                              {config.companyLogo ? (
                                <div
                                  className="w-8 h-8 rounded-full p-0.5"
                                  style={{
                                    background: `linear-gradient(45deg, ${config.themeColor}, ${adjustColor(config.themeColor, 40)})`
                                  }}
                                >
                                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                    <img
                                      src={config.companyLogo}
                                      alt="Agent"
                                      className="w-5 h-5 rounded-full object-cover"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                                  style={{
                                    background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                                  }}
                                >
                                  {config.agentName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-col gap-2 min-w-0">
                            <div
                              className={`
                                p-3 rounded-2xl text-sm break-words shadow-lg transition-all duration-200 hover:shadow-xl
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
                              <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                                {message.status === 'sending' && (
                                  <>
                                    <Clock className="w-3 h-3 animate-spin" />
                                    <span>Sending</span>
                                  </>
                                )}
                                {message.status === 'delivered' && (
                                  <>
                                    <Check className="w-3 h-3 text-green-500" />
                                    <span className="text-green-600">Delivered</span>
                                  </>
                                )}
                                {message.status === 'seen' && (
                                  <>
                                    <CheckCheck className="w-3 h-3 text-blue-500" />
                                    <span className="text-blue-600 font-medium">Seen</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-2 max-w-[85%]">
                          <div className="flex-shrink-0">
                            {config.companyLogo ? (
                              <div
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full p-0.5"
                                style={{
                                  background: `linear-gradient(45deg, ${config.themeColor}, ${adjustColor(config.themeColor, 40)})`
                                }}
                              >
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                  <img
                                    src={config.companyLogo}
                                    alt="Agent"
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg"
                                style={{
                                  background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                                }}
                              >
                                {config.agentName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="bg-white p-3 rounded-2xl rounded-bl-lg shadow-md border border-gray-100">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
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
                <div className="cwb-input-area cwb-p-4 cwb-bg-white cwb-border-t cwb-border-gray-100">
                  <div className="cwb-input-container cwb-flex cwb-space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="cwb-message-input cwb-flex-1 cwb-px-3 cwb-py-2 cwb-border cwb-border-gray-200 cwb-rounded-full cwb-text-sm focus:cwb-outline-none focus:cwb-ring-2 focus:cwb-ring-opacity-50"
                      style={{
                        '--tw-ring-color': config.themeColor,
                      } as React.CSSProperties}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleSendMessage(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      className="cwb-send-btn cwb-w-10 cwb-h-10 cwb-rounded-full cwb-text-white cwb-flex cwb-items-center cwb-justify-center hover:cwb-opacity-90 cwb-transition-opacity cwb-border-0"
                      style={{ backgroundColor: config.themeColor }}
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleSendMessage(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Send className="cwb-w-4 cwb-h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
