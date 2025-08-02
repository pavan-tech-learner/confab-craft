import { Palette, MessageCircle } from 'lucide-react';
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
              <Label className="cwb-field-label text-sm font-medium text-cwb-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cwb-primary" />
                Chat Icon Type
              </Label>
              
              <div className="cwb-icon-selection mt-3 grid grid-cols-2 gap-3">
                {[
                  { value: '💬', label: 'Message' },
                  { value: '📞', label: 'Call' },
                  { value: '👋', label: 'Agent' },
                  { value: '💡', label: 'Support' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onConfigChange({ welcomeMessageIcon: option.value })}
                    className={`cwb-icon-option p-3 flex items-center gap-3 rounded-lg border transition-all hover:shadow-sm ${
                      config.welcomeMessageIcon === option.value
                        ? 'border-cwb-primary bg-cwb-primary/5 text-cwb-primary'
                        : 'border-cwb-border hover:border-cwb-primary/30'
                    }`}
                  >
                    <span className="text-lg">{option.value}</span>
                    <span className="font-medium text-cwb-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
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