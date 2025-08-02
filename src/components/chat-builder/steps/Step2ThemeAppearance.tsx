import { Palette, MessageCircle, MessageSquare, Phone, Headphones, HelpCircle, Mail } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { ChatConfig } from '../../../types/chat-config';

interface Step2ThemeAppearanceProps {
  config: ChatConfig;
  onConfigChange: (updates: Partial<ChatConfig>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const colorPresets = [
  { name: 'Blue', color: '#6366f1' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Green', color: '#10b981' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Pink', color: '#ec4899' },
];

export const Step2ThemeAppearance = ({
  config,
  onConfigChange,
  onNext,
  onPrevious
}: Step2ThemeAppearanceProps) => {
  return (
    <div className="cwb-step2-container bg-cwb-card rounded-lg p-6">
      <div className="cwb-step2-header mb-6">
        <div className="cwb-section-icon mb-4">
          <div className="cwb-icon-circle w-12 h-12 bg-cwb-primary/10 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-cwb-primary" />
          </div>
        </div>
        <h2 className="cwb-section-title text-xl font-semibold text-cwb-foreground mb-2">
          Theme & Appearance
        </h2>
        <p className="cwb-section-subtitle text-cwb-muted-foreground">
          Customize the look and feel of your chat widget
        </p>
      </div>

      <div className="cwb-form-content space-y-6">
        {/* Color Theme Section */}
        <div className="cwb-form-section">
          <div className="cwb-section-header mb-4">
            <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground">
              Color Theme
            </h3>
          </div>

          <div className="cwb-color-picker-section space-y-4">
            <div className="cwb-color-presets">
              <Label className="cwb-field-label text-sm font-medium text-cwb-foreground mb-3 block">
                Choose a preset color
              </Label>
              <div className="cwb-preset-grid grid grid-cols-6 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.color}
                    className={`cwb-color-preset w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                      config.themeColor === preset.color 
                        ? 'border-cwb-foreground shadow-md' 
                        : 'border-cwb-border'
                    }`}
                    style={{ backgroundColor: preset.color }}
                    onClick={() => onConfigChange({ themeColor: preset.color })}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <div className="cwb-custom-color">
              <Label htmlFor="themeColor" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                Or enter custom color
              </Label>
              <div className="cwb-color-input-group flex items-center space-x-3 mt-1">
                <input
                  type="color"
                  value={config.themeColor}
                  onChange={(e) => onConfigChange({ themeColor: e.target.value })}
                  className="cwb-color-picker w-12 h-10 border border-cwb-border rounded cursor-pointer"
                />
                <Input
                  id="themeColor"
                  type="text"
                  value={config.themeColor}
                  onChange={(e) => onConfigChange({ themeColor: e.target.value })}
                  className="cwb-form-input flex-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                  placeholder="#6366f1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Icon Section */}
        <div className="cwb-form-section">
          <div className="cwb-section-header mb-4">
            <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground">
              Chat Icon
            </h3>
            <p className="text-sm text-cwb-muted-foreground">
              Choose the icon for your chat widget button
            </p>
          </div>

          <div className="cwb-icon-selection flex flex-row gap-4 items-center py-2 mb-6">
            {[
              { value: 'message-circle', icon: MessageCircle, label: 'Message Circle' },
              { value: 'message-square', icon: MessageSquare, label: 'Message Square' },
              { value: 'phone', icon: Phone, label: 'Phone' },
              { value: 'headphones', icon: Headphones, label: 'Headphones' },
              { value: 'help-circle', icon: HelpCircle, label: 'Help Circle' },
              { value: 'mail', icon: Mail, label: 'Mail' }
            ].map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onConfigChange({ chatIcon: option.value as any })}
                  className={`cwb-icon-option flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all focus:outline-none ${
                    config.chatIcon === option.value
                      ? 'border-cwb-primary text-cwb-primary bg-white ring-2 ring-cwb-primary'
                      : 'border-cwb-border text-cwb-foreground bg-transparent'
                  }`}
                  title={option.label}
                >
                  <IconComponent className="w-6 h-6" />
                </button>
              );
            })}
            {/* Custom Icon Option */}
            <label className={`cwb-icon-option flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all focus:outline-none cursor-pointer ${
              config.chatIcon === 'custom'
                ? 'border-cwb-primary text-cwb-primary bg-white ring-2 ring-cwb-primary'
                : 'border-cwb-border text-cwb-foreground bg-transparent'
            }`} title="Custom">
              {config.customChatIconUrl ? (
                <img src={config.customChatIconUrl} alt="Custom Icon" className="w-7 h-7 rounded-full object-cover border border-cwb-border" />
              ) : (
                <span className="w-6 h-6 flex items-center justify-center text-lg">+</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      onConfigChange({ customChatIconUrl: ev.target?.result as string, chatIcon: 'custom' });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Chat Prompt Section */}
        <div className="cwb-form-section">
          <details className="cwb-collapsible px-0 py-0 mb-6" open>
            <summary className="flex items-center justify-between cursor-pointer select-none text-base font-semibold text-cwb-foreground">
              <span>Chat Prompt</span>
              <span className="text-xs text-cwb-muted-foreground ml-2">Configure the message bubble above the chat icon</span>
            </summary>
            <div className="mt-4 space-y-4">
              {/* Visual style selector */}
              <div>
                <Label className="text-xs font-medium text-cwb-muted-foreground mb-2 block">Prompt Style</Label>
                <div className="flex flex-row gap-3">
                  {[
                    { value: 'bubble-above', label: 'Bubble Above', preview: (
                      <div className="w-20 flex flex-col items-center">
                        <div className="rounded-2xl bg-white border shadow px-3 py-1 text-xs text-cwb-foreground mb-1 max-w-[80px] text-center">Hi there!</div>
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="-mt-1">
                          <polygon points="0,0 18,0 9,12" fill="#fff" stroke="#e5e7eb" />
                        </svg>
                      </div>
                    ) },
                    { value: 'inline', label: 'Inline', preview: (
                      <div className="w-20 flex flex-row items-end gap-1">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                          <circle cx="9" cy="6" r="6" fill="#fff" stroke="#e5e7eb" />
                        </svg>
                        <div className="rounded-2xl bg-white border shadow px-3 py-1 text-xs text-cwb-foreground max-w-[80px] text-center">Hi there!</div>
                      </div>
                    ) }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`flex flex-col items-center px-2 py-1 rounded-lg border transition-all shadow-sm ${
                        (config.promptStyle || 'bubble-above') === option.value
                          ? 'border-cwb-primary ring-2 ring-cwb-primary bg-white'
                          : 'border-cwb-border bg-transparent'
                      }`}
                      onClick={() => onConfigChange({ promptStyle: option.value as any })}
                      title={option.label}
                    >
                      {option.preview}
                      <span className="text-xs mt-1">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt toggle and message */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-cwb-foreground">Show Chat Prompt</Label>
                  <p className="text-xs text-cwb-muted-foreground">Display a message bubble above the chat icon</p>
                </div>
                <Switch
                  checked={config.showChatPrompt}
                  onCheckedChange={(checked) => onConfigChange({ showChatPrompt: checked })}
                />
              </div>
              {config.showChatPrompt && (
                <div className="cwb-form-field">
                  <Label htmlFor="chatPromptMessage" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                    Prompt Message
                  </Label>
                  <Input
                    id="chatPromptMessage"
                    value={config.chatPromptMessage}
                    onChange={(e) => onConfigChange({ chatPromptMessage: e.target.value })}
                    className="cwb-form-input mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                    placeholder="Hi there, have a question? Text us here."
                  />
                </div>
              )}
            </div>
          </details>
        </div>

        {/* Messages Section */}
        <div className="cwb-form-section">
          <div className="cwb-section-header mb-4">
            <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground">
              Messages
            </h3>
          </div>

          <div className="cwb-message-fields space-y-4">
            <div className="cwb-form-field">
              <Label htmlFor="welcomeMessage" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                Welcome Message
              </Label>
              <Textarea
                id="welcomeMessage"
                value={config.welcomeMessage}
                onChange={(e) => onConfigChange({ welcomeMessage: e.target.value })}
                className="cwb-form-textarea mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                placeholder="Hi there! How can we help you today?"
                rows={3}
              />
            </div>



            <div className="cwb-form-field">
              <Label htmlFor="fallbackMessage" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                Fallback Message
              </Label>
              <Textarea
                id="fallbackMessage"
                value={config.fallbackMessage}
                onChange={(e) => onConfigChange({ fallbackMessage: e.target.value })}
                className="cwb-form-textarea mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                placeholder="Sorry, our agents are currently unavailable..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Display Options Section */}
        <div className="cwb-form-section">
          <div className="cwb-section-header mb-4">
            <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground">
              Display Options
            </h3>
          </div>

          <div className="cwb-display-options space-y-4">
            <div className="cwb-switch-field flex items-center justify-between">
              <div className="cwb-switch-label">
                <Label className="text-sm font-medium text-cwb-foreground">Show User Status</Label>
                <p className="text-xs text-cwb-muted-foreground">Display online/offline status</p>
              </div>
              <Switch
                checked={config.showUserStatus}
                onCheckedChange={(checked) => onConfigChange({ showUserStatus: checked })}
              />
            </div>

            <div className="cwb-switch-field flex items-center justify-between">
              <div className="cwb-switch-label">
                <Label className="text-sm font-medium text-cwb-foreground">Show Message Status</Label>
                <p className="text-xs text-cwb-muted-foreground">Show read receipts and typing indicators</p>
              </div>
              <Switch
                checked={config.showMessageStatus}
                onCheckedChange={(checked) => onConfigChange({ showMessageStatus: checked })}
              />
            </div>

            <div className="cwb-switch-field flex items-center justify-between">
              <div className="cwb-switch-label">
                <Label className="text-sm font-medium text-cwb-foreground">Show Agent Icon</Label>
                <p className="text-xs text-cwb-muted-foreground">Display agent avatar in header</p>
              </div>
              <Switch
                checked={config.showAgentIcon}
                onCheckedChange={(checked) => onConfigChange({ showAgentIcon: checked })}
              />
            </div>
          </div>
        </div>
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