import { Info, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

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
    const newRequiredFields = {
      ...config.requiredFields,
      [field]: checked
    };

    // Ensure at least 2 fields are required
    const requiredCount = Object.values(newRequiredFields).filter(Boolean).length;
    if (requiredCount >= 2 || checked) {
      onConfigChange({
        requireUserInfo: true, // Always keep this true
        requiredFields: newRequiredFields
      });
    }
  };

  // Count currently required fields
  const requiredFieldsCount = Object.values(config.requiredFields).filter(Boolean).length;

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
          User information collection is mandatory. Select at least 2 required fields.
        </p>
      </div>

      <div className="cwb-form-content space-y-6">
        {/* Status Info */}
        <div className="cwb-form-section">
          <div className="cwb-status-info p-4 bg-cwb-primary/10 border border-cwb-primary/20 rounded-lg">
            <div className="cwb-status-content">
              <p className="text-sm font-medium text-cwb-primary">
                ✓ User Information Collection is Mandatory
              </p>
              <p className="text-xs text-cwb-muted-foreground mt-1">
                Users must provide their details before starting the conversation. At least 2 fields are required.
              </p>
              <p className="text-xs text-cwb-foreground mt-2">
                Currently required fields: <span className="font-medium">{requiredFieldsCount}</span>
                {requiredFieldsCount < 2 && <span className="text-red-500 ml-1">(Minimum 2 required)</span>}
              </p>
            </div>
          </div>
        </div>
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
                  Select at least 2 fields that users must fill to continue
                </p>
              </div>

              <div className="cwb-checkbox-fields space-y-4">
                <div className="cwb-checkbox-field flex items-center justify-between p-3 bg-cwb-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="requireName"
                      checked={config.requiredFields.name}
                      onCheckedChange={(checked) => handleRequiredFieldChange('name', checked as boolean)}
                      className="border-cwb-border data-[state=checked]:bg-cwb-primary data-[state=checked]:border-cwb-primary"
                      disabled={config.requiredFields.name && requiredFieldsCount <= 2}
                    />
                    <Label htmlFor="requireName" className="text-sm font-medium text-cwb-foreground cursor-pointer">
                      Name
                    </Label>
                  </div>
                  {config.requiredFields.name && requiredFieldsCount <= 2 && (
                    <span className="text-xs text-cwb-muted-foreground">Required (minimum)</span>
                  )}
                </div>

                <div className="cwb-checkbox-field flex items-center justify-between p-3 bg-cwb-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="requireEmail"
                      checked={config.requiredFields.email}
                      onCheckedChange={(checked) => handleRequiredFieldChange('email', checked as boolean)}
                      className="border-cwb-border data-[state=checked]:bg-cwb-primary data-[state=checked]:border-cwb-primary"
                      disabled={config.requiredFields.email && requiredFieldsCount <= 2}
                    />
                    <Label htmlFor="requireEmail" className="text-sm font-medium text-cwb-foreground cursor-pointer">
                      Email Address
                    </Label>
                  </div>
                  {config.requiredFields.email && requiredFieldsCount <= 2 && (
                    <span className="text-xs text-cwb-muted-foreground">Required (minimum)</span>
                  )}
                </div>

                <div className="cwb-checkbox-field flex items-center justify-between p-3 bg-cwb-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="requirePhone"
                      checked={config.requiredFields.phone}
                      onCheckedChange={(checked) => handleRequiredFieldChange('phone', checked as boolean)}
                      className="border-cwb-border data-[state=checked]:bg-cwb-primary data-[state=checked]:border-cwb-primary"
                      disabled={config.requiredFields.phone && requiredFieldsCount <= 2}
                    />
                    <Label htmlFor="requirePhone" className="text-sm font-medium text-cwb-foreground cursor-pointer">
                      Phone Number
                    </Label>
                  </div>
                  {config.requiredFields.phone && requiredFieldsCount <= 2 && (
                    <span className="text-xs text-cwb-muted-foreground">Required (minimum)</span>
                  )}
                </div>
              </div>

              {requiredFieldsCount < 2 && (
                <div className="cwb-validation-message p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    ⚠️ Please select at least 2 required fields to continue.
                  </p>
                </div>
              )}
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
          disabled={requiredFieldsCount < 2}
          className="cwb-nav-btn bg-cwb-primary text-cwb-primary-foreground hover:bg-cwb-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next {requiredFieldsCount < 2 && '(Select 2+ fields)'}
        </Button>
      </div>
    </div>
  );
};