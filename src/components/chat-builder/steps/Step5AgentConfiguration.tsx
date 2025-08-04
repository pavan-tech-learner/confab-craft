import { Settings, Bot, User, Globe } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ChatConfig } from '../../../types/chat-config';

interface Step5AgentConfigurationProps {
  config: ChatConfig;
  onConfigChange: (updates: Partial<ChatConfig>) => void;
  onFinish: () => void;
  onPrevious: () => void;
}

export const Step5AgentConfiguration = ({
  config,
  onConfigChange,
  onFinish,
  onPrevious
}: Step5AgentConfigurationProps) => {
  const handleOpenAIConfigChange = (field: keyof ChatConfig['openaiConfig'], value: string) => {
    onConfigChange({
      openaiConfig: {
        ...config.openaiConfig,
        [field]: value
      }
    });
  };

  const handleCustomAgentConfigChange = (field: keyof ChatConfig['customAgentConfig'], value: string) => {
    onConfigChange({
      customAgentConfig: {
        ...config.customAgentConfig,
        [field]: value
      }
    });
  };

  return (
    <div className="cwb-step5-container bg-cwb-card rounded-lg p-6">
      <div className="cwb-step5-header mb-6">
        <div className="cwb-section-icon mb-4">
          <div className="cwb-icon-circle w-12 h-12 bg-cwb-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-cwb-primary" />
          </div>
        </div>
        <h2 className="cwb-section-title text-xl font-semibold text-cwb-foreground mb-2">
          Agent Configuration
        </h2>
        <p className="cwb-section-subtitle text-cwb-muted-foreground">
          Configure how your chat agent responds to messages
        </p>
      </div>

      <div className="cwb-step5-content space-y-8">
        {/* Agent Type Selection */}
        <div className="cwb-agent-type-section">
          <Label htmlFor="agentType" className="cwb-label text-sm font-medium text-cwb-foreground mb-3 block">
            Agent Type
          </Label>
          <Select 
            value={config.agentType} 
            onValueChange={(value: 'human' | 'ai' | 'custom') => onConfigChange({ agentType: value })}
          >
            <SelectTrigger className="cwb-select-trigger">
              <SelectValue placeholder="Select agent type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="human">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Human Agent
                </div>
              </SelectItem>
              <SelectItem value="ai">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Agent (OpenAI)
                </div>
              </SelectItem>
              <SelectItem value="custom">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Custom Webhook
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="cwb-help-text text-xs text-cwb-muted-foreground mt-2">
            {config.agentType === 'human' && 'Messages will be handled by human agents'}
            {config.agentType === 'ai' && 'Messages will be automatically responded to by OpenAI'}
            {config.agentType === 'custom' && 'Messages will be sent to your custom webhook endpoint'}
          </p>
        </div>

        {/* OpenAI Configuration */}
        {config.agentType === 'ai' && (
          <div className="cwb-openai-section p-4 bg-cwb-muted/20 rounded-lg space-y-4">
            <div className="cwb-section-header">
              <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-cwb-primary" />
                OpenAI Configuration
              </h3>
              <p className="cwb-section-description text-sm text-cwb-muted-foreground">
                Configure your OpenAI integration for AI-powered responses
              </p>
            </div>

            <div className="cwb-openai-fields space-y-4">
              <div className="cwb-api-key-field">
                <Label htmlFor="openaiApiKey" className="cwb-label text-sm font-medium text-cwb-foreground">
                  OpenAI API Key
                </Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  value={config.openaiConfig.apiKey}
                  onChange={(e) => handleOpenAIConfigChange('apiKey', e.target.value)}
                  placeholder="sk-..."
                  className="cwb-input"
                />
                <p className="cwb-help-text text-xs text-cwb-muted-foreground mt-1">
                  Your OpenAI API key (kept secure and encrypted)
                </p>
              </div>

              <div className="cwb-model-field">
                <Label htmlFor="openaiModel" className="cwb-label text-sm font-medium text-cwb-foreground">
                  Model
                </Label>
                <Select 
                  value={config.openaiConfig.model} 
                  onValueChange={(value) => handleOpenAIConfigChange('model', value)}
                >
                  <SelectTrigger className="cwb-select-trigger">
                    <SelectValue placeholder="Select OpenAI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Recommended)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4 (More capable, slower)</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Latest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="cwb-system-prompt-field">
                <Label htmlFor="systemPrompt" className="cwb-label text-sm font-medium text-cwb-foreground">
                  System Prompt
                </Label>
                <Textarea
                  id="systemPrompt"
                  value={config.openaiConfig.systemPrompt}
                  onChange={(e) => handleOpenAIConfigChange('systemPrompt', e.target.value)}
                  placeholder="You are a helpful customer support assistant..."
                  className="cwb-textarea min-h-[100px]"
                />
                <p className="cwb-help-text text-xs text-cwb-muted-foreground mt-1">
                  Instructions that define how the AI should behave and respond
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Webhook Configuration */}
        {config.agentType === 'custom' && (
          <div className="cwb-custom-section p-4 bg-cwb-muted/20 rounded-lg space-y-4">
            <div className="cwb-section-header">
              <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-cwb-primary" />
                Custom Webhook Configuration
              </h3>
              <p className="cwb-section-description text-sm text-cwb-muted-foreground">
                Configure your custom webhook endpoint for message handling
              </p>
            </div>

            <div className="cwb-webhook-fields space-y-4">
              <div className="cwb-webhook-url-field">
                <Label htmlFor="webhookUrl" className="cwb-label text-sm font-medium text-cwb-foreground">
                  Webhook URL
                </Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={config.customAgentConfig.webhookUrl}
                  onChange={(e) => handleCustomAgentConfigChange('webhookUrl', e.target.value)}
                  placeholder="https://your-api.com/webhook"
                  className="cwb-input"
                />
                <p className="cwb-help-text text-xs text-cwb-muted-foreground mt-1">
                  POST endpoint that will receive chat messages
                </p>
              </div>

              <div className="cwb-webhook-headers-field">
                <Label htmlFor="webhookHeaders" className="cwb-label text-sm font-medium text-cwb-foreground">
                  Custom Headers (JSON)
                </Label>
                <Textarea
                  id="webhookHeaders"
                  value={JSON.stringify(config.customAgentConfig.headers, null, 2)}
                  onChange={(e) => {
                    try {
                      const headers = JSON.parse(e.target.value);
                      handleCustomAgentConfigChange('headers', headers);
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='{\n  "Authorization": "Bearer your-token",\n  "Content-Type": "application/json"\n}'
                  className="cwb-textarea min-h-[100px] font-mono text-xs"
                />
                <p className="cwb-help-text text-xs text-cwb-muted-foreground mt-1">
                  Custom headers to include with webhook requests (JSON format)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Human Agent Configuration */}
        {config.agentType === 'human' && (
          <div className="cwb-human-section p-4 bg-cwb-muted/20 rounded-lg">
            <div className="cwb-section-header">
              <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-cwb-primary" />
                Human Agent Configuration
              </h3>
              <p className="cwb-section-description text-sm text-cwb-muted-foreground">
                Messages will be handled by human agents. Configure your agent dashboard and notification settings separately.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="cwb-step-navigation flex justify-between items-center mt-8 pt-6 border-t border-cwb-border">
        <Button 
          variant="ghost" 
          onClick={onPrevious}
          className="cwb-nav-btn text-cwb-muted-foreground hover:text-cwb-foreground"
        >
          Previous
        </Button>
        <Button 
          onClick={onFinish}
          className="cwb-nav-btn bg-cwb-success text-cwb-success-foreground hover:bg-cwb-success/90"
        >
          Finish Configuration
        </Button>
      </div>
    </div>
  );
};
