export interface ChatConfig {
  themeColor: string;
  welcomeMessage: string;
  fallbackMessage: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showUserStatus: boolean;
  showMessageStatus: boolean;
  showAgentIcon: boolean;
  companyName: string;
  agentName: string;
  companyLogo?: string;

  // User information collection
  requireUserInfo: boolean;
  requiredFields: {
    name: boolean;
    email: boolean;
    phone: boolean;
  };
  userInfoMessage: string;

  // Agent configuration
  agentType: 'human' | 'ai' | 'custom';
  openaiConfig: {
    apiKey: string;
    model: string;
    systemPrompt: string;
  };
  customAgentConfig: {
    webhookUrl: string;
    headers: Record<string, string>;
  };

  // Business hours
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      monday: { enabled: boolean; startTime: string; endTime: string };
      tuesday: { enabled: boolean; startTime: string; endTime: string };
      wednesday: { enabled: boolean; startTime: string; endTime: string };
      thursday: { enabled: boolean; startTime: string; endTime: string };
      friday: { enabled: boolean; startTime: string; endTime: string };
      saturday: { enabled: boolean; startTime: string; endTime: string };
      sunday: { enabled: boolean; startTime: string; endTime: string };
    };
    outsideHoursMessage: string;
  };

  // Disconnect settings
  disconnectSettings: {
    enabled: boolean;
    inactivityTimeoutMinutes: number;
    disconnectMessage: string;
    showReconnectButton: boolean;
  };
}

export const defaultConfig: ChatConfig = {
  themeColor: '#6366f1',
  welcomeMessage: 'Hi there! How can we help you today?',
  fallbackMessage: 'Sorry, our agents are currently unavailable. Please leave a message and we\'ll get back to you soon!',
  position: 'bottom-right',
  showUserStatus: true,
  showMessageStatus: true,
  showAgentIcon: true,
  companyName: 'Your Company',
  agentName: 'Support Agent',

  requireUserInfo: false,
  requiredFields: {
    name: true,
    email: true,
    phone: false
  },
  userInfoMessage: 'Please provide your details to start the conversation:',
  agentType: 'human',
  openaiConfig: {
    apiKey: '',
    model: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful customer support assistant.'
  },
  customAgentConfig: {
    webhookUrl: '',
    headers: {}
  },
  businessHours: {
    enabled: false,
    timezone: 'UTC',
    schedule: {
      monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    },
    outsideHoursMessage: 'We\'re currently offline. Please leave a message and we\'ll get back to you during business hours.'
  },
  disconnectSettings: {
    enabled: false,
    inactivityTimeoutMinutes: 15,
    disconnectMessage: 'You\'ve been disconnected due to inactivity. Please start a new conversation if you need further assistance.',
    showReconnectButton: true
  }
};