import { Settings, Bot, User, Globe } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ChatConfig } from '../../../types/chat-config';

interface Step4AgentConfigurationProps {
  config: ChatConfig;
  onConfigChange: (updates: Partial<ChatConfig>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step4AgentConfiguration = ({
  config,
  onConfigChange,
  onNext,
  onPrevious
}: Step4AgentConfigurationProps) => {
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
    <div className="cwb-step4-container bg-cwb-card rounded-lg p-6">
      <div className="cwb-step4-header mb-6">
        <div className="cwb-section-icon mb-4">
          <div className="cwb-icon-circle w-12 h-12 bg-cwb-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-cwb-primary" />
          </div>
        </div>
        <h2 className="cwb-section-title text-xl font-semibold text-cwb-foreground mb-2">
          Agent Configuration
        </h2>
        <p className="cwb-section-subtitle text-cwb-muted-foreground">
          Configure how your chat agent will respond to users
        </p>
      </div>

      <div className="cwb-form-content space-y-6">
        {/* Agent Type Selection */}
        <div className="cwb-form-section">
          <div className="cwb-section-header mb-4">
            <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground">
              Agent Type
            </h3>
            <p className="text-sm text-cwb-muted-foreground">
              Choose how your chat will be handled
            </p>
          </div>

          <div className="cwb-agent-types grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`cwb-agent-option p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.agentType === 'human'
                  ? 'border-cwb-primary bg-cwb-primary/5'
                  : 'border-cwb-border hover:border-cwb-primary/50'
              }`}
              onClick={() => onConfigChange({ agentType: 'human' })}
            >
              <User className="w-8 h-8 text-cwb-primary mb-3" />
              <h4 className="font-medium text-cwb-foreground mb-2">Human Agent</h4>
              <p className="text-sm text-cwb-muted-foreground">
                Messages are handled by human agents
              </p>
            </div>

            <div
              className={`cwb-agent-option p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.agentType === 'ai'
                  ? 'border-cwb-primary bg-cwb-primary/5'
                  : 'border-cwb-border hover:border-cwb-primary/50'
              }`}
              onClick={() => onConfigChange({ agentType: 'ai' })}
            >
              <Bot className="w-8 h-8 text-cwb-primary mb-3" />
              <h4 className="font-medium text-cwb-foreground mb-2">AI Agent</h4>
              <p className="text-sm text-cwb-muted-foreground">
                Powered by OpenAI GPT models
              </p>
            </div>

            <div
              className={`cwb-agent-option p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.agentType === 'custom'
                  ? 'border-cwb-primary bg-cwb-primary/5'
                  : 'border-cwb-border hover:border-cwb-primary/50'
              }`}
              onClick={() => onConfigChange({ agentType: 'custom' })}
            >
              <Globe className="w-8 h-8 text-cwb-primary mb-3" />
              <h4 className="font-medium text-cwb-foreground mb-2">Custom Agent</h4>
              <p className="text-sm text-cwb-muted-foreground">
                Connect to your own API endpoint
              </p>
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        {config.agentType === 'ai' && (
          <div className="cwb-form-section">
            <div className="cwb-section-header mb-4">
              <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center">
                <Bot className="w-5 h-5 text-cwb-primary mr-2" />
                OpenAI Configuration
              </h3>
            </div>

            <div className="cwb-ai-config space-y-4">
              <div className="cwb-form-field">
                <Label htmlFor="apiKey" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.openaiConfig.apiKey}
                  onChange={(e) => handleOpenAIConfigChange('apiKey', e.target.value)}
                  className="cwb-form-input mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                  placeholder="sk-..."
                />
                <p className="text-xs text-cwb-muted-foreground mt-1">
                  Your OpenAI API key (kept secure and encrypted)
                </p>
              </div>

              <div className="cwb-form-field">
                <Label htmlFor="model" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                  Model
                </Label>
                <Select 
                  value={config.openaiConfig.model} 
                  onValueChange={(value) => handleOpenAIConfigChange('model', value)}
                >
                  <SelectTrigger className="cwb-form-select mt-1 border-cwb-input-border">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="cwb-form-field">
                <Label htmlFor="systemPrompt" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                  System Prompt
                </Label>
                <Textarea
                  id="systemPrompt"
                  value={config.openaiConfig.systemPrompt}
                  onChange={(e) => handleOpenAIConfigChange('systemPrompt', e.target.value)}
                  className="cwb-form-textarea mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                  placeholder="You are a helpful customer support assistant..."
                  rows={4}
                />
                <p className="text-xs text-cwb-muted-foreground mt-1">
                  Instructions for how the AI should behave
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Agent Configuration */}
        {config.agentType === 'custom' && (
          <div className="cwb-form-section">
            <div className="cwb-section-header mb-4">
              <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center">
                <Globe className="w-5 h-5 text-cwb-primary mr-2" />
                Custom Agent Configuration
              </h3>
            </div>

            <div className="cwb-custom-config space-y-4">
              <div className="cwb-form-field">
                <Label htmlFor="webhookUrl" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                  Webhook URL
                </Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={config.customAgentConfig.webhookUrl}
                  onChange={(e) => handleCustomAgentConfigChange('webhookUrl', e.target.value)}
                  className="cwb-form-input mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                  placeholder="https://api.yourservice.com/chat"
                />
                <p className="text-xs text-cwb-muted-foreground mt-1">
                  Your API endpoint that will receive chat messages
                </p>
              </div>
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
          onClick={onNext}
          className="cwb-nav-btn bg-cwb-primary text-cwb-primary-foreground hover:bg-cwb-primary-dark"
        >
          Next
        </Button>
      </div>
    </div>
  );
};