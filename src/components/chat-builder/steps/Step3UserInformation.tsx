import { Info, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Checkbox } from '../../ui/checkbox';
import { ChatConfig } from '../../../types/chat-config';

interface Step3UserInformationProps {
  config: ChatConfig;
  onConfigChange: (updates: Partial<ChatConfig>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step3UserInformation = ({
  config,
  onConfigChange,
  onNext,
  onPrevious
}: Step3UserInformationProps) => {
  const handleRequiredFieldChange = (field: keyof ChatConfig['requiredFields'], checked: boolean) => {
    onConfigChange({
      requiredFields: {
        ...config.requiredFields,
        [field]: checked
      }
    });
  };

  return (
    <div className="cwb-step3-container bg-cwb-card rounded-lg p-6">
      <div className="cwb-step3-header mb-6">
        <div className="cwb-section-icon mb-4">
          <div className="cwb-icon-circle w-12 h-12 bg-cwb-primary/10 rounded-lg flex items-center justify-center">
            <Info className="w-6 h-6 text-cwb-primary" />
          </div>
        </div>
        <h2 className="cwb-section-title text-xl font-semibold text-cwb-foreground mb-2">
          User Information Collection
        </h2>
        <p className="cwb-section-subtitle text-cwb-muted-foreground">
          Configure what information to collect from users before chat
        </p>
      </div>

      <div className="cwb-form-content space-y-6">
        {/* Main Toggle */}
        <div className="cwb-form-section">
          <div className="cwb-switch-field flex items-center justify-between p-4 bg-cwb-muted/30 rounded-lg">
            <div className="cwb-switch-label">
              <Label className="text-sm font-medium text-cwb-foreground">
                Require user information before chat
              </Label>
              <p className="text-xs text-cwb-muted-foreground mt-1">
                Collect user details before starting the conversation
              </p>
            </div>
            <Switch
              checked={config.requireUserInfo}
              onCheckedChange={(checked) => onConfigChange({ requireUserInfo: checked })}
            />
          </div>
        </div>

        {config.requireUserInfo && (
          <>
            {/* Message Configuration */}
            <div className="cwb-form-section">
              <div className="cwb-section-header mb-4">
                <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center">
                  <MessageSquare className="w-5 h-5 text-cwb-primary mr-2" />
                  Message to show users
                </h3>
              </div>

              <div className="cwb-form-field">
                <Textarea
                  value={config.userInfoMessage}
                  onChange={(e) => onConfigChange({ userInfoMessage: e.target.value })}
                  className="cwb-form-textarea border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                  placeholder="Please provide your details to start the conversation:"
                  rows={3}
                />
              </div>
            </div>

            {/* Required Fields */}
            <div className="cwb-form-section">
              <div className="cwb-section-header mb-4">
                <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground">
                  Required Fields
                </h3>
                <p className="text-sm text-cwb-muted-foreground">
                  Select which fields are required for users to fill
                </p>
              </div>

              <div className="cwb-checkbox-fields space-y-4">
                <div className="cwb-checkbox-field flex items-center space-x-3">
                  <Checkbox
                    id="requireName"
                    checked={config.requiredFields.name}
                    onCheckedChange={(checked) => handleRequiredFieldChange('name', checked as boolean)}
                    className="border-cwb-border data-[state=checked]:bg-cwb-primary data-[state=checked]:border-cwb-primary"
                  />
                  <Label htmlFor="requireName" className="text-sm font-medium text-cwb-foreground cursor-pointer">
                    Name
                  </Label>
                </div>

                <div className="cwb-checkbox-field flex items-center space-x-3">
                  <Checkbox
                    id="requireEmail"
                    checked={config.requiredFields.email}
                    onCheckedChange={(checked) => handleRequiredFieldChange('email', checked as boolean)}
                    className="border-cwb-border data-[state=checked]:bg-cwb-primary data-[state=checked]:border-cwb-primary"
                  />
                  <Label htmlFor="requireEmail" className="text-sm font-medium text-cwb-foreground cursor-pointer">
                    Email Address
                  </Label>
                </div>

                <div className="cwb-checkbox-field flex items-center space-x-3">
                  <Checkbox
                    id="requirePhone"
                    checked={config.requiredFields.phone}
                    onCheckedChange={(checked) => handleRequiredFieldChange('phone', checked as boolean)}
                    className="border-cwb-border data-[state=checked]:bg-cwb-primary data-[state=checked]:border-cwb-primary"
                  />
                  <Label htmlFor="requirePhone" className="text-sm font-medium text-cwb-foreground cursor-pointer">
                    Phone Number
                  </Label>
                </div>
              </div>
            </div>
          </>
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