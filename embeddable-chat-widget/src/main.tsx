import React from 'react'
import ReactDOM from 'react-dom/client'
import { EmbeddableChatWidget } from './components/EmbeddableChatWidget'
import { defaultConfig } from './types/chat-config'

// Development preview
const devConfig = {
  ...defaultConfig,
  themeColor: '#6366f1',
  companyName: 'Demo Company',
  agentName: 'Demo Agent',
  welcomeMessage: 'Hello! This is a demo of the embeddable chat widget.',
  chatPromptMessage: 'Hi there! Need help? Click to chat with us.',
  showChatPrompt: true,
  position: 'bottom-right' as const,
  showUserStatus: true,
  showMessageStatus: true,
  showAgentIcon: true,
  requireUserInfo: true
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* The actual widget */}
      <EmbeddableChatWidget
        config={devConfig}
        apiBaseUrl="https://demo-api.com"
        widgetId="demo-widget"
      />
    </div>
  </React.StrictMode>,
)
