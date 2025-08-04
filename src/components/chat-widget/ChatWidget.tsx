// import { useState, useEffect } from 'react';
// import { MessageCircle, X, Minimize2, Send, User, MessageSquare, Phone, Headphones, HelpCircle, Mail } from 'lucide-react';
// import { ChatConfig } from '../../types/chat-config';

// interface ChatWidgetProps {
//   config: ChatConfig;
//   className?: string;
// }

// export const ChatWidget = ({ config, className = "" }: ChatWidgetProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showUserForm, setShowUserForm] = useState(config.requireUserInfo);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: config.welcomeMessage,
//       isUser: false,
//       timestamp: new Date()
//     }
//   ]);
//   const [userInfo, setUserInfo] = useState({
//     name: '',
//     email: '',
//     phone: ''
//   });

//   // Reset form when config changes
//   useEffect(() => {
//     setShowUserForm(config.requireUserInfo);
//   }, [config.requireUserInfo]);

//   const handleStartChat = () => {
//     setShowUserForm(false);
//     setMessages([
//       {
//         id: 1,
//         text: config.welcomeMessage,
//         isUser: false,
//         timestamp: new Date()
//       }
//     ]);
//   };

//   const handleSendMessage = (text: string) => {
//     const newMessage = {
//       id: messages.length + 1,
//       text,
//       isUser: true,
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, newMessage]);
//   };

//   const getPositionClasses = () => {
//     switch (config.position) {
//       case 'bottom-left':
//         return 'bottom-4 left-4';
//       case 'top-right':
//         return 'top-4 right-4';
//       case 'top-left':
//         return 'top-4 left-4';
//       default:
//         return 'bottom-4 right-4';
//     }
//   };

//   return (
//     <div className={`cwb-chat-widget fixed ${getPositionClasses()} z-50 ${className}`}>
//       {isOpen ? (
//         <div 
//           className="cwb-chat-window bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden"
//           style={{ 
//             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
//           }}
//         >
//           {/* Header */}
//           <div 
//             className="cwb-chat-header px-4 py-3 text-white flex items-center justify-between"
//             style={{ backgroundColor: config.themeColor }}
//           >

//             <div className="cwb-header-content flex items-center space-x-3">
//               {config.showAgentIcon && (
//                 <div className="cwb-agent-avatar w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
//                   {config.companyLogo ? (
//                     <img 
//                       src={config.companyLogo} 
//                       alt="Agent" 
//                       className="w-6 h-6 rounded-full object-cover"
//                     />
//                   ) : (
//                     <User className="w-4 h-4 text-white" />
//                   )}
//                 </div>
//               )}
//               <div className="cwb-header-text">
//                 <div className="cwb-company-name text-sm font-medium">
//                   {config.companyName}
//                 </div>
//                 {config.showUserStatus && (
//                   <div className="cwb-agent-status flex items-center text-xs opacity-90">
//                     <div className="cwb-status-dot w-2 h-2 bg-green-400 rounded-full mr-1"></div>
//                     {config.agentName} is online
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="cwb-header-actions flex items-center">
//   <button 
//     className="cwb-close-btn text-white/80 hover:text-white transition-colors"
//     onClick={() => setIsOpen(false)}
//     aria-label="Close"
//   >
//     <X className="w-4 h-4" />
//   </button>
// </div>
//           </div>

//           {/* Messages Area */}
//           <div className="cwb-messages-area flex-1 p-4 overflow-y-auto bg-gray-50">
//             {showUserForm ? (
//               <div className="cwb-user-form space-y-4">
//                 <div 
//                   className="cwb-welcome-bubble bg-white p-3 rounded-lg shadow-sm text-sm flex items-center gap-2"
//                   style={{ borderLeft: `3px solid ${config.themeColor}` }}
//                 >
//                   <span className="text-xl">👋</span>
//                   <span style={{ color: config.themeColor }} className="font-medium">
//                     Welcome!
//                   </span>
//                 </div>
//                 <div className="cwb-form-message text-sm text-gray-600 mb-4">
//                   {config.userInfoMessage}
//                 </div>
                
//                 {config.requiredFields.name && (
//                   <div className="cwb-form-field">
//                     <label className="cwb-field-label text-xs text-gray-600 mb-1 block">
//                       Name *
//                     </label>
//                     <input 
//                       type="text"
//                       placeholder="Your name"
//                       value={userInfo.name}
//                       onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
//                       className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
//                       style={{ 
//                         '--tw-ring-color': config.themeColor,
//                         'focusRingColor': config.themeColor
//                       } as React.CSSProperties}
//                     />
//                   </div>
//                 )}
                
//                 {config.requiredFields.email && (
//                   <div className="cwb-form-field">
//                     <label className="cwb-field-label text-xs text-gray-600 mb-1 block">
//                       Email *
//                     </label>
//                     <input 
//                       type="email"
//                       placeholder="your@email.com"
//                       value={userInfo.email}
//                       onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
//                       className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
//                       style={{ 
//                         '--tw-ring-color': config.themeColor,
//                         'focusRingColor': config.themeColor
//                       } as React.CSSProperties}
//                     />
//                   </div>
//                 )}
                
//                 {config.requiredFields.phone && (
//                   <div className="cwb-form-field">
//                     <label className="cwb-field-label text-xs text-gray-600 mb-1 block">
//                       Phone *
//                     </label>
//                     <input 
//                       type="tel"
//                       placeholder="+1 (555) 123-4567"
//                       value={userInfo.phone}
//                       onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
//                       className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
//                       style={{ 
//                         '--tw-ring-color': config.themeColor,
//                         'focusRingColor': config.themeColor
//                       } as React.CSSProperties}
//                     />
//                   </div>
//                 )}
                
//                 <button 
//                   className="cwb-start-chat-btn w-full py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//                   style={{ backgroundColor: config.themeColor }}
//                   onClick={handleStartChat}
//                 >
//                   Start Chat
//                 </button>
//               </div>
//             ) : (
//               <div className="cwb-messages-list space-y-3">
//                 {messages.map((message) => (
//                   <div 
//                     key={message.id}
//                     className={`cwb-message flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div 
//                       className={`cwb-message-bubble max-w-[80%] px-3 py-2 rounded-lg text-sm ${
//                         message.isUser 
//                           ? 'text-white' 
//                           : 'bg-white text-gray-800 shadow-sm'
//                       }`}
//                       style={message.isUser ? { backgroundColor: config.themeColor } : {}}
//                     >
//                       {message.text}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Input Area */}
//           {!showUserForm && (
//             <div className="cwb-input-area p-4 border-t border-gray-100">
//               <div className="cwb-input-container flex items-center space-x-2">
//                 <input 
//                   type="text"
//                   placeholder="Type your message..."
//                   className="cwb-message-input flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
//                   style={{ 
//                     '--tw-ring-color': config.themeColor,
//                     'focusRingColor': config.themeColor
//                   } as React.CSSProperties}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter' && e.currentTarget.value.trim()) {
//                       handleSendMessage(e.currentTarget.value);
//                       e.currentTarget.value = '';
//                     }
//                   }}
//                 />
//                 <button 
//                   className="cwb-send-btn w-8 h-8 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-opacity"
//                   style={{ backgroundColor: config.themeColor }}
//                 >
//                   <Send className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         <>
//           {/* Chat Prompt Bubble or Inline Prompt */}
//           {config.showChatPrompt && (
//             config.promptStyle === 'inline' ? (
//               <div className="cwb-chat-prompt-inline flex items-center gap-2 mb-2 animate-fade-in" style={{ position: 'absolute', bottom: '4.5rem', right: 0, zIndex: 60 }}>
//                 <input
//                   type="text"
//                   className="cwb-prompt-input border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2"
//                   placeholder={config.chatPromptMessage || 'Hi there, have a question? Text us here.'}
//                   style={{ minWidth: 180, maxWidth: 260 }}
//                   onKeyPress={e => {
//                     if (e.key === 'Enter' && e.currentTarget.value.trim()) {
//                       handleSendMessage(e.currentTarget.value);
//                       e.currentTarget.value = '';
//                     }
//                   }}
//                 />
//                 <button
//                   className="cwb-send-btn w-8 h-8 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-opacity"
//                   style={{ backgroundColor: config.themeColor }}
//                   onClick={e => {
//                     const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
//                     if (input && input.value.trim()) {
//                       handleSendMessage(input.value);
//                       input.value = '';
//                     }
//                   }}
//                 >
//                   <Send className="w-4 h-4" />
//                 </button>
//               </div>
//             ) : (
//               <div
//                 className="cwb-chat-prompt-bubble flex items-center gap-3 mb-2 animate-fade-in" style={{ position: 'absolute', bottom: '4.5rem', right: 0, zIndex: 60, alignItems: 'center' }}
//               >
//                 {config.companyLogo && (
//                   <img src={config.companyLogo} alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow mr-2" />
//                 )}
//                 <div className="relative bg-white px-4 py-2 rounded-xl shadow-md text-gray-800 flex items-center min-w-[200px]">
//                   <span className="block text-sm whitespace-pre-line mr-6">{config.chatPromptMessage || 'Hi there, have a question? Text us here.'}</span>
//                   <button
//                     className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xs"
//                     style={{ lineHeight: '1' }}
//                     onClick={e => { e.stopPropagation(); if (typeof window !== 'undefined') { (e.target as HTMLElement).parentElement?.parentElement?.remove(); } }}
//                     aria-label="Close prompt"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                   {/* SVG pointer at right end only for bubble-above */}
//                   {config.promptStyle !== 'inline' && (
//                     <svg
//                       className="absolute -bottom-3 right-3"
//                       width="18"
//                       height="12"
//                       viewBox="0 0 18 12"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       style={{ zIndex: 1 }}
//                     >
//                       <polygon points="0,0 18,0 9,12" fill="#fff" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.08))" />
//                     </svg>
//                   )}
//                 </div>
//               </div>
//             )
//           )}
//           <button 
//             className="cwb-chat-bubble w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
//             style={{ backgroundColor: config.themeColor }}
//             onClick={() => setIsOpen(true)}
//           >
//             {/* Dynamic chat icon for minimized state, including custom */}
//             {(() => {
//               if (config.chatIcon === 'custom' && config.customChatIconUrl) {
//                 return <img src={config.customChatIconUrl} alt="Chat Icon" className="w-6 h-6 rounded-full object-cover" />;
//               }
//               switch (config.chatIcon) {
//                 case 'message-square': return <MessageSquare className="w-6 h-6" />;
//                 case 'phone': return <Phone className="w-6 h-6" />;
//                 case 'headphones': return <Headphones className="w-6 h-6" />;
//                 case 'help-circle': return <HelpCircle className="w-6 h-6" />;
//                 case 'mail': return <Mail className="w-6 h-6" />;
//                 default: return <MessageCircle className="w-6 h-6" />;
//               }
//             })()}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Send, User, MessageSquare, Phone, Headphones, HelpCircle, Mail, Check, CheckCheck, Clock, Sparkles } from 'lucide-react';
import { ChatConfig } from '../../types/chat-config';

interface ChatWidgetProps {
  config: ChatConfig;
  className?: string;
}

// Modern typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1 h-1 bg-gray-400 rounded-full"
          style={{
            animation: `typing 1.4s infinite ease-in-out ${i * 0.2}s`
          }}
        />
      ))}
    </div>
    <span className="text-xs text-gray-500 ml-2">typing...</span>
  </div>
);

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

export const ChatWidget = ({ config, className = "" }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(config.requireUserInfo);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
      status: 'delivered' as const
    }
  ]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        timestamp: new Date(),
        status: 'delivered' as const
      }
    ]);
  };

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date(),
      status: 'sending' as const
    };
    setMessages(prev => [...prev, newMessage]);

    // Update message status to delivered
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
      ));
    }, 800);

    // Set typing indicator and simulate response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! I'm here to help you. ✨",
        "Great question! Let me get you the perfect solution. 🚀",
        "I'd be happy to assist you with that! 💫",
        "Absolutely! I'm on it right away. 🌟"
      ];

      const agentResponse = {
        id: Date.now() + Math.random(), // Better unique ID
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
        status: 'delivered' as const
      };
      
      setMessages(prev => {
        const updatedMessages = prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'seen' as const } : msg
        );
        return [...updatedMessages, agentResponse];
      });
      setIsTyping(false);
    }, 2500);
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

  // Helper functions
  const adjustColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
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
      `}</style>

      <div className={`cwb-chat-widget fixed ${getPositionClasses()} z-50 ${className}`}>
        {isOpen ? (
          <div 
            className="cwb-chat-window glass-effect rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden chat-window-enter"
          >
            {/* Enhanced Header */}
            <div 
              className="cwb-chat-header px-4 py-3 text-white flex items-center justify-between relative overflow-hidden rounded-t-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 30)} 100%)`
              }}
            >
              <FloatingParticles />

              <div className="cwb-header-content flex items-center space-x-3 relative z-10">
                {config.showAgentIcon && (
                  <div className="cwb-agent-avatar">
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
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                )}
                <div className="cwb-header-text">
                  <div className="cwb-company-name text-sm font-bold">
                    {config.companyName}
                  </div>
                  {config.showUserStatus && (
                    <div className="cwb-agent-status flex items-center text-xs opacity-90">
                      <div className="cwb-status-dot w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <Sparkles className="w-3 h-3 mr-1" />
                      <span className="font-medium">{config.agentName} is online</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="cwb-header-actions flex items-center relative z-10">
                <button 
                  className="cwb-close-btn text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="cwb-messages-area flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
              {showUserForm ? (
                <div className="cwb-user-form space-y-4">
                  <div className="text-center mb-4">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-white text-xs font-medium shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Welcome!
                    </div>
                  </div>
                  
                  <div className="cwb-form-message text-sm text-gray-600 mb-4 text-center">
                    {config.userInfoMessage}
                  </div>
                  
                  {config.requiredFields.name && (
                    <div className="cwb-form-field">
                      <label className="cwb-field-label text-xs text-gray-600 mb-1 block font-medium">
                        Name *
                      </label>
                      <input 
                        type="text"
                        placeholder="Your name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-md"
                        style={{ 
                          '--tw-ring-color': config.themeColor,
                          borderColor: userInfo.name ? config.themeColor : ''
                        } as React.CSSProperties}
                      />
                    </div>
                  )}
                  
                  {config.requiredFields.email && (
                    <div className="cwb-form-field">
                      <label className="cwb-field-label text-xs text-gray-600 mb-1 block font-medium">
                        Email *
                      </label>
                      <input 
                        type="email"
                        placeholder="your@email.com"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-md"
                        style={{ 
                          '--tw-ring-color': config.themeColor,
                          borderColor: userInfo.email ? config.themeColor : ''
                        } as React.CSSProperties}
                      />
                    </div>
                  )}
                  
                  {config.requiredFields.phone && (
                    <div className="cwb-form-field">
                      <label className="cwb-field-label text-xs text-gray-600 mb-1 block font-medium">
                        Phone *
                      </label>
                      <input 
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="cwb-form-input w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-md"
                        style={{ 
                          '--tw-ring-color': config.themeColor,
                          borderColor: userInfo.phone ? config.themeColor : ''
                        } as React.CSSProperties}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-center pt-2">
                    <button 
                      className="cwb-start-chat-btn px-6 py-2 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      style={{ 
                        background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                      }}
                      onClick={handleStartChat}
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              ) : (
                <div className="cwb-messages-list space-y-3">
                  {messages.map((message, index) => (
                    <div 
                      key={message.id}
                      className={`cwb-message flex message-enter ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Enhanced Agent Icon */}
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
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                                style={{
                                  background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                                }}
                              >
                                {config.agentName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col gap-1">
                          <div 
                            className={`
                              cwb-message-bubble px-3 py-2 rounded-2xl text-sm break-words shadow-lg transition-all duration-200 hover:shadow-xl
                              ${message.isUser 
                                ? 'text-white rounded-br-lg transform hover:scale-[1.02]' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-lg shadow-md hover:shadow-lg'
                              }
                            `}
                            style={message.isUser ? { 
                              background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                            } : {}}
                          >
                            {message.text}
                          </div>

                          {/* Enhanced Message Status */}
                          {config.showMessageStatus && message.isUser && message.status && (
                            <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
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

                  {/* Modern Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start message-enter">
                      <div className="flex gap-3 max-w-[85%]">
                        {config.showAgentIcon && (
                          <div className="flex-shrink-0">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse"
                              style={{
                                background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                              }}
                            >
                              {config.agentName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-lg shadow-lg">
                          <TypingIndicator />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {!showUserForm && (
              <div className="cwb-input-area p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="cwb-input-container flex items-center space-x-2">
                  <input 
                    type="text"
                    placeholder="Type your message..."
                    className="cwb-message-input flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      '--tw-ring-color': config.themeColor
                    } as React.CSSProperties}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleSendMessage(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button 
                    className="cwb-send-btn w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`
                    }}
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
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
          <>
            {/* Chat Prompt Bubble or Inline Prompt */}
            {config.showChatPrompt && (
              config.promptStyle === 'inline' ? (
                <div className="cwb-chat-prompt-inline flex items-center gap-2 mb-2 animate-fade-in" style={{ position: 'absolute', bottom: '4.5rem', right: 0, zIndex: 60 }}>
                  <input
                    type="text"
                    className="cwb-prompt-input border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2"
                    placeholder={config.chatPromptMessage || 'Hi there, have a question? Text us here.'}
                    style={{ minWidth: 180, maxWidth: 260 }}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleSendMessage(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    className="cwb-send-btn w-8 h-8 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: config.themeColor }}
                    onClick={e => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      if (input && input.value.trim()) {
                        handleSendMessage(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="cwb-chat-prompt-bubble flex items-center gap-3 mb-2 animate-fade-in" style={{ position: 'absolute', bottom: '4.5rem', right: 0, zIndex: 60, alignItems: 'center' }}
                >
                  {config.companyLogo && (
                    <img src={config.companyLogo} alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow mr-2" />
                  )}
                  <div className="relative bg-white px-4 py-2 rounded-xl shadow-md text-gray-800 flex items-center min-w-[200px]">
                    <span className="block text-sm whitespace-pre-line mr-6">{config.chatPromptMessage || 'Hi there, have a question? Text us here.'}</span>
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xs"
                      style={{ lineHeight: '1' }}
                      onClick={e => { e.stopPropagation(); if (typeof window !== 'undefined') { (e.target as HTMLElement).parentElement?.parentElement?.remove(); } }}
                      aria-label="Close prompt"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {/* SVG pointer at right end only for bubble-above */}
                    {config.promptStyle !== 'inline' && (
                      <svg
                        className="absolute -bottom-3 right-3"
                        width="18"
                        height="12"
                        viewBox="0 0 18 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ zIndex: 1 }}
                      >
                        <polygon points="0,0 18,0 9,12" fill="#fff" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.08))" />
                      </svg>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Enhanced Chat Button */}
            <div className="relative">
              <button 
                className={`
                  cwb-chat-bubble w-14 h-14 rounded-full text-white shadow-2xl transition-all duration-300 
                  hover:scale-110 hover:shadow-3xl border-0 relative overflow-hidden
                  flex items-center justify-center cursor-pointer
                  ${showWelcomeAnimation ? 'chat-button-pulse' : ''}
                `}
                style={{ 
                  background: `linear-gradient(135deg, ${config.themeColor} 0%, ${adjustColor(config.themeColor, 20)} 100%)`,
                  boxShadow: `0 10px 40px ${config.themeColor}40`
                }}
                onClick={() => setIsOpen(true)}
              >
                <div className="shimmer-bg absolute inset-0 rounded-full" />
                
                {/* Dynamic chat icon for minimized state, including custom */}
                {(() => {
                  if (config.chatIcon === 'custom' && config.customChatIconUrl) {
                    return <img src={config.customChatIconUrl} alt="Chat Icon" className="w-6 h-6 rounded-full object-cover relative z-10" />;
                  }
                  switch (config.chatIcon) {
                    case 'message-square': return <MessageSquare className="w-6 h-6 relative z-10" />;
                    case 'phone': return <Phone className="w-6 h-6 relative z-10" />;
                    case 'headphones': return <Headphones className="w-6 h-6 relative z-10" />;
                    case 'help-circle': return <HelpCircle className="w-6 h-6 relative z-10" />;
                    case 'mail': return <Mail className="w-6 h-6 relative z-10" />;
                    default: return <MessageCircle className="w-6 h-6 relative z-10" />;
                  }
                })()}

                {/* Notification badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce">
                  1
                </div>
              </button>

              {/* Floating ring animation */}
              <div
                className="absolute inset-0 rounded-full border-2 animate-ping opacity-30 pointer-events-none"
                style={{ borderColor: config.themeColor }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};