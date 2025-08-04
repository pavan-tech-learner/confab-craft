import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, MessageSquare, Phone, Headphones, HelpCircle, Mail, Check, CheckCheck, Clock } from 'lucide-react';
import { ChatConfig, ChatMessage } from '../types/chat-config';

interface EmbeddableChatWidgetProps {
  config: ChatConfig;
  apiBaseUrl?: string;
  widgetId?: string;
  onMessageSent?: (message: string) => void;
  onConfigFetched?: (config: ChatConfig) => void;
}

// Floating particles component for header animation
const FloatingParticles = () => (
  <div className="cwb-floating-particles cwb-absolute cwb-inset-0 cwb-overflow-hidden cwb-pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="cwb-particle cwb-absolute cwb-w-1 cwb-h-1 cwb-bg-white-20 cwb-rounded-full cwb-animate-pulse"
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

export const EmbeddableChatWidget = ({ 
  config, 
  apiBaseUrl, 
  widgetId, 
  onMessageSent,
  onConfigFetched 
}: EmbeddableChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(config.requireUserInfo);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: config.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
      status: 'delivered'
    }
  ]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update welcome message when config changes
  useEffect(() => {
    setMessages(prev => prev.map(msg => 
      msg.id === 1 ? { ...msg, text: config.welcomeMessage } : msg
    ));
  }, [config.welcomeMessage]);

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

  const handleSendMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };
    setMessages(prev => [...prev, newMessage]);

    // Call external handler if provided
    if (onMessageSent) {
      onMessageSent(text);
    }

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

    // Send to API if configured
    if (apiBaseUrl && widgetId) {
      try {
        const response = await fetch(`${apiBaseUrl}/api/chat/${widgetId}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
            userInfo,
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.reply) {
            setTimeout(() => {
              const agentResponse: ChatMessage = {
                id: messages.length + 2,
                text: data.reply,
                isUser: false,
                timestamp: new Date(),
                status: 'delivered'
              };
              setMessages(prev => [...prev, agentResponse]);
              setIsTyping(false);
            }, 1000);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }

    // Fallback response
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! I'm here to help you. ✨",
        "Great question! Let me get you the perfect solution. 🚀",
        "I'd be happy to assist you with that! 💫",
        "Absolutely! I'm on it right away. 🌟"
      ];
      
      const agentResponse: ChatMessage = {
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

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left':
        return 'cwb-bottom-4 cwb-left-4 sm:cwb-bottom-6 sm:cwb-left-6';
      case 'top-right':
        return 'cwb-top-4 cwb-right-4 sm:cwb-top-6 sm:cwb-right-6';
      case 'top-left':
        return 'cwb-top-4 cwb-left-4 sm:cwb-top-6 sm:cwb-left-6';
      default:
        return 'cwb-bottom-4 cwb-right-4 sm:cwb-bottom-6 sm:cwb-right-6';
    }
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
      {/* Custom CSS for animations and styling */}
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

        @keyframes cwb-glow {
          0%, 100% {
            box-shadow: 0 0 20px ${config.themeColor}40, 0 0 40px ${config.themeColor}20, 0 0 60px ${config.themeColor}10;
          }
          50% {
            box-shadow: 0 0 30px ${config.themeColor}60, 0 0 60px ${config.themeColor}40, 0 0 90px ${config.themeColor}20;
          }
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

        /* Custom utility classes with cwb- prefix for complete isolation */
        .cwb-fixed { position: fixed; }
        .cwb-relative { position: relative; }
        .cwb-absolute { position: absolute; }
        .cwb-bottom-4 { bottom: 1rem; }
        .cwb-right-4 { right: 1rem; }
        .cwb-left-4 { left: 1rem; }
        .cwb-top-4 { top: 1rem; }
        .cwb-bottom-6 { bottom: 1.5rem; }
        .cwb-right-6 { right: 1.5rem; }
        .cwb-left-6 { left: 1.5rem; }
        .cwb-top-6 { top: 1.5rem; }
        .cwb-bottom-full { bottom: 100%; }
        .cwb-right-0 { right: 0; }
        .cwb-mb-3 { margin-bottom: 0.75rem; }
        .cwb-bg-white { background-color: white; }
        .cwb-rounded-lg { border-radius: 0.5rem; }
        .cwb-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .cwb-p-3 { padding: 0.75rem; }
        .cwb-p-4 { padding: 1rem; }
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
        .cwb-z-50 { z-index: 50; }
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
        .cwb-top-full { top: 100%; }
        .cwb-right-4 { right: 1rem; }
        .cwb-w-0 { width: 0; }
        .cwb-h-0 { height: 0; }
        .cwb-w-1 { width: 0.25rem; }
        .cwb-h-1 { height: 0.25rem; }
        .cwb-bg-white-20 { background-color: rgba(255, 255, 255, 0.2); }
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
        .cwb-font-sans { font-family: ui-sans-serif, system-ui, sans-serif; }
        .cwb-flex-col { flex-direction: column; }
        .cwb-gap-2 { gap: 0.5rem; }
        .cwb-gap-3 { gap: 0.75rem; }
        .cwb-space-y-3 > * + * { margin-top: 0.75rem; }
        .cwb-space-y-4 > * + * { margin-top: 1rem; }
        .cwb-max-w-80 { max-width: 20rem; }
        .cwb-max-w-85 { max-width: 85%; }
        .cwb-rounded-2xl { border-radius: 1rem; }
        .cwb-rounded-3xl { border-radius: 1.5rem; }
        .cwb-rounded-br-lg { border-bottom-right-radius: 0.5rem; }
        .cwb-rounded-bl-lg { border-bottom-left-radius: 0.5rem; }
        .cwb-rounded-bl-md { border-bottom-left-radius: 0.375rem; }
        .cwb-text-center { text-align: center; }
        .cwb-break-words { word-wrap: break-word; }
        .cwb-min-w-0 { min-width: 0; }
        .cwb-flex-shrink-0 { flex-shrink: 0; }
        .cwb-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cwb-justify-end { justify-content: flex-end; }
        .cwb-justify-start { justify-content: flex-start; }
        .cwb-flex-row-reverse { flex-direction: row-reverse; }
        .cwb-flex-row { flex-direction: row; }
        .cwb-bg-gray-50 { background-color: #f9fafb; }
        .cwb-overflow-y-auto { overflow-y: auto; }
        .cwb-w-2 { width: 0.5rem; }
        .cwb-h-2 { height: 0.5rem; }
        .cwb-bg-gray-400 { background-color: #9ca3af; }
        .cwb-text-green-600 { color: #16a34a; }
        .cwb-text-green-500 { color: #22c55e; }
        .cwb-text-blue-600 { color: #2563eb; }
        .cwb-text-blue-500 { color: #3b82f6; }
        .cwb-text-gray-500 { color: #6b7280; }
        .cwb-w-72 { width: 18rem; }
        .cwb-h-80 { height: 20rem; }
        .cwb-w-80 { width: 20rem; }
        .cwb-h-96 { height: 24rem; }
        .cwb-w-96 { width: 24rem; }
        .cwb-h-520 { height: 32.5rem; }
        .cwb-w-420 { width: 26.25rem; }
        .cwb-h-580 { height: 36.25rem; }

        /* Hover states */
        .cwb-chat-bubble:hover { transform: scale(1.1); }
        .cwb-send-btn:hover { opacity: 0.9; }
        .cwb-text-gray-400:hover { color: #6b7280; }
        .cwb-scale-110:hover { transform: scale(1.1); }
        .cwb-shadow-3xl:hover { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
        .cwb-opacity-90:hover { opacity: 0.9; }

        /* Focus states */
        .cwb-message-input:focus { outline: none; ring: 2px; ring-opacity: 0.5; }
        .cwb-outline-none:focus { outline: none; }
        .cwb-ring-2:focus { ring: 2px; }
        .cwb-ring-opacity-50:focus { ring-opacity: 0.5; }
        .cwb-transition-opacity { transition: opacity 0.15s ease-in-out; }

        /* Responsive utilities */
        @media (min-width: 640px) {
          .sm\\:cwb-bottom-6 { bottom: 1.5rem; }
          .sm\\:cwb-right-6 { right: 1.5rem; }
          .sm\\:cwb-left-6 { left: 1.5rem; }
          .sm\\:cwb-top-6 { top: 1.5rem; }
          .sm\\:cwb-w-80 { width: 20rem; }
          .sm\\:cwb-h-96 { height: 24rem; }
          .sm\\:cwb-rounded-3xl { border-radius: 1.5rem; }
          .sm\\:cwb-p-4 { padding: 1rem; }
          .sm\\:cwb-gap-3 { gap: 0.75rem; }
          .sm\\:cwb-space-y-4 > * + * { margin-top: 1rem; }
          .sm\\:cwb-w-8 { width: 2rem; }
          .sm\\:cwb-h-8 { height: 2rem; }
          .sm\\:cwb-w-10 { width: 2.5rem; }
          .sm\\:cwb-h-10 { height: 2.5rem; }
          .sm\\:cwb-text-base { font-size: 1rem; line-height: 1.5rem; }
          .sm\\:cwb-text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .sm\\:cwb-w-5 { width: 1.25rem; }
          .sm\\:cwb-h-5 { height: 1.25rem; }
          .sm\\:cwb-w-6 { width: 1.5rem; }
          .sm\\:cwb-h-6 { height: 1.5rem; }
          .sm\\:cwb-p-3 { padding: 0.75rem; }
          .sm\\:cwb-w-3 { width: 0.75rem; }
          .sm\\:cwb-h-3 { height: 0.75rem; }
          .sm\\:cwb-gap-2 { gap: 0.5rem; }
          .sm\\:cwb-max-w-80 { max-width: 80%; }
        }

        @media (min-width: 768px) {
          .md\\:cwb-w-96 { width: 24rem; }
          .md\\:cwb-h-520 { height: 32.5rem; }
          .md\\:cwb-p-5 { padding: 1.25rem; }
          .md\\:cwb-gap-4 { gap: 1rem; }
          .md\\:cwb-w-12 { width: 3rem; }
          .md\\:cwb-h-12 { height: 3rem; }
          .md\\:cwb-text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .md\\:cwb-w-8 { width: 2rem; }
          .md\\:cwb-h-8 { height: 2rem; }
          .md\\:cwb-w-10 { width: 2.5rem; }
          .md\\:cwb-h-10 { height: 2.5rem; }
          .md\\:cwb-w-6 { width: 1.5rem; }
          .md\\:cwb-h-6 { height: 1.5rem; }
          .md\\:cwb-p-4 { padding: 1rem; }
        }

        @media (min-width: 1024px) {
          .lg\\:cwb-w-420 { width: 26.25rem; }
          .lg\\:cwb-h-580 { height: 36.25rem; }
        }
      `}</style>

      <div
        className={`cwb-chat-widget cwb-fixed cwb-font-sans cwb-transition-all cwb-duration-500 ${getPositionClasses()} cwb-z-50`}
        style={{
          '--widget-primary': config.themeColor,
        } as React.CSSProperties}
      >
        {/* Responsive Chat Button */}
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

            <button
              onClick={() => setIsOpen(true)}
              className={`
                cwb-w-14 cwb-h-14 cwb-rounded-full cwb-shadow-2xl cwb-transition-all cwb-duration-300
                hover:cwb-scale-110 hover:cwb-shadow-3xl cwb-border-0 cwb-text-white cwb-relative cwb-overflow-hidden
                cwb-flex cwb-items-center cwb-justify-center cwb-cursor-pointer
                ${showWelcomeAnimation ? 'cwb-chat-button-pulse' : ''}
              `}
              style={{
                background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`,
                boxShadow: `0 10px 40px ${config.themeColor}40`
              }}
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

        {/* Chat Window */}
        {isOpen && (
          <div className="cwb-w-72 cwb-h-80 sm:cwb-w-80 sm:cwb-h-96 md:cwb-w-96 md:cwb-h-520 lg:cwb-w-420 lg:cwb-h-580 cwb-glass-effect cwb-rounded-2xl sm:cwb-rounded-3xl cwb-shadow-2xl cwb-flex cwb-flex-col cwb-overflow-hidden cwb-chat-window-enter">
            {/* Enhanced Header */}
            <div
              className="cwb-chat-header cwb-relative cwb-p-3 sm:cwb-p-4 md:cwb-p-5 cwb-text-white cwb-flex cwb-items-center cwb-justify-between cwb-rounded-t-2xl sm:cwb-rounded-t-3xl cwb-overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 30)} 100%)`
              }}
            >
              <FloatingParticles />

              <div className="cwb-header-content cwb-flex cwb-items-center cwb-gap-2 sm:cwb-gap-3 md:cwb-gap-4 cwb-relative cwb-z-10 cwb-min-w-0 cwb-flex-1">
                {config.showAgentIcon && (
                  <div className="cwb-agent-avatar cwb-flex-shrink-0">
                    {config.companyLogo ? (
                      <div
                        className="cwb-w-8 cwb-h-8 sm:cwb-w-10 sm:cwb-h-10 md:cwb-w-12 md:cwb-h-12 cwb-rounded-full cwb-p-0.5"
                        style={{
                          background: `linear-gradient(45deg, ${config.themeColor}, ${adjustColor(config.themeColor, 40)})`
                        }}
                      >
                        <div className="cwb-w-full cwb-h-full cwb-bg-white cwb-rounded-full cwb-flex cwb-items-center cwb-justify-center">
                          <img
                            src={config.companyLogo}
                            alt="Agent"
                            className="cwb-w-5 cwb-h-5 sm:cwb-w-6 sm:cwb-h-6 md:cwb-w-8 md:cwb-h-8 cwb-rounded-full cwb-object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="cwb-w-8 cwb-h-8 sm:cwb-w-10 sm:cwb-h-10 md:cwb-w-12 md:cwb-h-12 cwb-rounded-full cwb-flex cwb-items-center cwb-justify-center cwb-text-white cwb-text-sm cwb-font-bold cwb-shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                        }}
                      >
                        {config.agentName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                <div className="cwb-header-text cwb-min-w-0 cwb-flex-1">
                  <div className="cwb-company-name cwb-font-bold cwb-text-sm sm:cwb-text-base md:cwb-text-lg cwb-truncate">
                    {config.companyName}
                  </div>
                  {config.showUserStatus && (
                    <div className="cwb-agent-status cwb-flex cwb-items-center cwb-gap-1 sm:cwb-gap-2 cwb-text-xs sm:cwb-text-sm cwb-opacity-90">
                      <div className="cwb-status-dot cwb-w-2 cwb-h-2 cwb-rounded-full cwb-bg-green-400 cwb-animate-pulse" />
                      <span>{config.agentName} is online</span>
                      <span className="cwb-opacity-60">• Live</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="cwb-header-actions cwb-flex cwb-items-center cwb-gap-1 sm:cwb-gap-2 cwb-relative cwb-z-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="cwb-close-btn cwb-w-8 cwb-h-8 cwb-bg-gray-600 cwb-bg-opacity-80 hover:cwb-bg-opacity-100 cwb-rounded-full cwb-transition-all cwb-duration-200 hover:cwb-scale-110 cwb-flex cwb-items-center cwb-justify-center"
                >
                  <X className="cwb-w-4 cwb-h-4 cwb-text-white cwb-stroke-2" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="cwb-messages-area cwb-flex-1 cwb-overflow-y-auto cwb-p-3 sm:cwb-p-4 cwb-space-y-3 sm:cwb-space-y-4 cwb-bg-white">
              {showUserForm ? (
                <div className="cwb-user-form cwb-space-y-4">
                  <div
                    className="cwb-welcome-bubble cwb-bg-white cwb-p-3 cwb-rounded-lg cwb-shadow-sm cwb-text-sm cwb-flex cwb-items-center cwb-gap-2"
                    style={{ borderLeft: `3px solid ${config.themeColor}` }}
                  >
                    <span className="cwb-text-xl">👋</span>
                    <span style={{ color: config.themeColor }} className="cwb-font-medium">
                      Welcome!
                    </span>
                  </div>
                  <div className="cwb-form-message cwb-text-sm cwb-text-gray-600 cwb-mb-4">
                    {config.userInfoMessage}
                  </div>

                  {config.requiredFields.name && (
                    <div className="cwb-form-field">
                      <label className="cwb-field-label cwb-text-xs cwb-text-gray-600 cwb-mb-1 cwb-block">
                        Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="cwb-form-input cwb-w-full cwb-px-3 cwb-py-2 cwb-border cwb-border-gray-200 cwb-rounded-md cwb-text-sm focus:cwb-outline-none focus:cwb-ring-2 focus:cwb-ring-opacity-50"
                        style={{
                          '--tw-ring-color': config.themeColor,
                          'focusRingColor': config.themeColor
                        } as React.CSSProperties}
                      />
                    </div>
                  )}

                  {config.requiredFields.email && (
                    <div className="cwb-form-field">
                      <label className="cwb-field-label cwb-text-xs cwb-text-gray-600 cwb-mb-1 cwb-block">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="cwb-form-input cwb-w-full cwb-px-3 cwb-py-2 cwb-border cwb-border-gray-200 cwb-rounded-md cwb-text-sm focus:cwb-outline-none focus:cwb-ring-2 focus:cwb-ring-opacity-50"
                        style={{
                          '--tw-ring-color': config.themeColor,
                          'focusRingColor': config.themeColor
                        } as React.CSSProperties}
                      />
                    </div>
                  )}

                  {config.requiredFields.phone && (
                    <div className="cwb-form-field">
                      <label className="cwb-field-label cwb-text-xs cwb-text-gray-600 cwb-mb-1 cwb-block">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        className="cwb-form-input cwb-w-full cwb-px-3 cwb-py-2 cwb-border cwb-border-gray-200 cwb-rounded-md cwb-text-sm focus:cwb-outline-none focus:cwb-ring-2 focus:cwb-ring-opacity-50"
                        style={{
                          '--tw-ring-color': config.themeColor,
                          'focusRingColor': config.themeColor
                        } as React.CSSProperties}
                      />
                    </div>
                  )}

                  <button
                    className="cwb-start-chat-btn cwb-w-full cwb-py-2 cwb-text-white cwb-rounded-md cwb-text-sm cwb-font-medium hover:cwb-opacity-90 cwb-transition-opacity"
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
                      className={`cwb-message cwb-flex cwb-message-enter ${message.isUser ? 'cwb-justify-end' : 'cwb-justify-start'}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`cwb-flex cwb-gap-2 sm:cwb-gap-3 cwb-max-w-85 sm:cwb-max-w-80 ${message.isUser ? 'cwb-flex-row-reverse' : 'cwb-flex-row'}`}>
                        {/* Agent Icon */}
                        {!message.isUser && config.showAgentIcon && (
                          <div className="cwb-flex-shrink-0">
                            {config.companyLogo ? (
                              <div
                                className="cwb-w-6 cwb-h-6 sm:cwb-w-8 sm:cwb-h-8 md:cwb-w-10 md:cwb-h-10 cwb-rounded-full cwb-p-0.5"
                                style={{
                                  background: `linear-gradient(45deg, ${config.themeColor}, ${adjustColor(config.themeColor, 40)})`
                                }}
                              >
                                <div className="cwb-w-full cwb-h-full cwb-bg-white cwb-rounded-full cwb-flex cwb-items-center cwb-justify-center">
                                  <img
                                    src={config.companyLogo}
                                    alt="Agent"
                                    className="cwb-w-4 cwb-h-4 sm:cwb-w-5 sm:cwb-h-5 md:cwb-w-6 md:cwb-h-6 cwb-rounded-full cwb-object-cover"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="cwb-w-6 cwb-h-6 sm:cwb-w-8 sm:cwb-h-8 md:cwb-w-10 md:cwb-h-10 cwb-rounded-full cwb-flex cwb-items-center cwb-justify-center cwb-text-white cwb-text-xs sm:cwb-text-sm cwb-font-bold cwb-shadow-lg"
                                style={{
                                  background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                                }}
                              >
                                {config.agentName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="cwb-flex cwb-flex-col cwb-gap-1 sm:cwb-gap-2 cwb-min-w-0">
                          <div
                            className={`
                              cwb-p-2 sm:cwb-p-3 md:cwb-p-4 cwb-rounded-2xl sm:cwb-rounded-3xl cwb-text-xs sm:cwb-text-sm cwb-break-words cwb-shadow-lg cwb-transition-all cwb-duration-200 hover:cwb-shadow-xl
                              ${message.isUser
                                ? 'cwb-text-white cwb-rounded-br-lg transform hover:cwb-scale-102'
                                : 'cwb-bg-white cwb-border cwb-border-gray-100 cwb-rounded-bl-lg cwb-shadow-md hover:cwb-shadow-lg'
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
                            <div className="cwb-flex cwb-items-center cwb-justify-end cwb-gap-1 sm:cwb-gap-2 cwb-text-xs cwb-text-gray-500">
                              {message.status === 'sending' && (
                                <>
                                  <Clock className="cwb-w-2 cwb-h-2 sm:cwb-w-3 sm:cwb-h-3 cwb-animate-spin" />
                                  <span>Sending</span>
                                </>
                              )}
                              {message.status === 'delivered' && (
                                <>
                                  <Check className="cwb-w-2 cwb-h-2 sm:cwb-w-3 sm:cwb-h-3 cwb-text-green-500" />
                                  <span className="cwb-text-green-600">Delivered</span>
                                </>
                              )}
                              {message.status === 'seen' && (
                                <>
                                  <CheckCheck className="cwb-w-2 cwb-h-2 sm:cwb-w-3 sm:cwb-h-3 cwb-text-blue-500" />
                                  <span className="cwb-text-blue-600 cwb-font-medium">Seen</span>
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
                    <div className="cwb-typing-indicator cwb-flex cwb-justify-start">
                      <div className="cwb-bg-white cwb-p-3 cwb-rounded-2xl cwb-rounded-bl-md cwb-shadow-sm cwb-max-w-80">
                        <div className="cwb-flex cwb-space-x-1">
                          <div className="cwb-w-2 cwb-h-2 cwb-bg-gray-400 cwb-rounded-full cwb-animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="cwb-w-2 cwb-h-2 cwb-bg-gray-400 cwb-rounded-full cwb-animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="cwb-w-2 cwb-h-2 cwb-bg-gray-400 cwb-rounded-full cwb-animate-bounce" style={{ animationDelay: '300ms' }} />
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
              <div className="cwb-input-area cwb-p-4 cwb-bg-white">
                <div className="cwb-input-container cwb-relative cwb-flex cwb-items-center cwb-bg-gray-50 cwb-rounded-full cwb-border cwb-border-gray-200 focus-within:cwb-border-black cwb-px-4 cwb-py-2 cwb-transition-colors">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="cwb-message-input cwb-flex-1 cwb-bg-transparent cwb-border-0 cwb-outline-none cwb-text-sm cwb-placeholder-gray-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleSendMessage(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    className="cwb-send-btn cwb-w-8 cwb-h-8 cwb-rounded-full cwb-text-white cwb-flex cwb-items-center cwb-justify-center hover:cwb-opacity-90 cwb-transition-all cwb-duration-200 hover:cwb-scale-110 cwb-border-0 cwb-ml-2"
                    style={{
                      backgroundColor: config.themeColor,
                      boxShadow: `0 2px 8px ${config.themeColor}40`
                    }}
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
    </>
  );
};
