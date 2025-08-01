import { Upload, User } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ChatConfig } from '../../../types/chat-config';

interface Step1CompanyBrandingProps {
  config: ChatConfig;
  onConfigChange: (updates: Partial<ChatConfig>) => void;
  onNext: () => void;
}

export const Step1CompanyBranding = ({
  config,
  onConfigChange,
  onNext
}: Step1CompanyBrandingProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onConfigChange({ companyLogo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="cwb-step1-container bg-cwb-card rounded-lg p-6">
      <div className="cwb-step1-header mb-6">
        <div className="cwb-section-icon mb-4">
          <div className="cwb-icon-circle w-12 h-12 bg-cwb-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-cwb-primary" />
          </div>
        </div>
        <h2 className="cwb-section-title text-xl font-semibold text-cwb-foreground mb-2">
          Company & Branding
        </h2>
        <p className="cwb-section-subtitle text-cwb-muted-foreground">
          Set up your company information and branding
        </p>
      </div>

      <div className="cwb-form-content space-y-6">
        {/* Company Information Section */}
        <div className="cwb-form-section">
          <div className="cwb-section-header mb-4">
            <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center">
              <User className="w-5 h-5 text-cwb-primary mr-2" />
              Company Information
            </h3>
          </div>

          <div className="cwb-form-fields space-y-4">
            <div className="cwb-form-field">
              <Label htmlFor="companyName" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                value={config.companyName}
                onChange={(e) => onConfigChange({ companyName: e.target.value })}
                className="cwb-form-input mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                placeholder="Your Company"
              />
            </div>

            <div className="cwb-form-field">
              <Label htmlFor="agentName" className="cwb-field-label text-sm font-medium text-cwb-foreground">
                Agent Name
              </Label>
              <Input
                id="agentName"
                type="text"
                value={config.agentName}
                onChange={(e) => onConfigChange({ agentName: e.target.value })}
                className="cwb-form-input mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                placeholder="Support Agent"
              />
            </div>
          </div>
        </div>

        {/* Logo Configuration Section */}
        <div className="cwb-form-section">
          <div className="cwb-section-header mb-4">
            <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center">
              <Upload className="w-5 h-5 text-cwb-primary mr-2" />
              Logo Configuration
            </h3>
          </div>

          <div className="cwb-upload-area">
            <Label htmlFor="logoUpload" className="cwb-field-label text-sm font-medium text-cwb-foreground block mb-2">
              Upload Logo
            </Label>
            
            <div className="cwb-upload-zone border-2 border-dashed border-cwb-border rounded-lg p-6 text-center hover:border-cwb-primary transition-colors cursor-pointer">
              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="logoUpload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-cwb-muted-foreground mx-auto mb-2" />
                <div className="cwb-upload-text">
                  <p className="text-sm text-cwb-foreground font-medium">Choose File</p>
                  <p className="text-xs text-cwb-muted-foreground">No file chosen</p>
                </div>
              </label>
            </div>

            <div className="cwb-upload-alternative mt-4">
              <div className="cwb-divider flex items-center">
                <div className="flex-1 border-t border-cwb-border"></div>
                <span className="cwb-divider-text px-3 text-xs text-cwb-muted-foreground bg-cwb-card">
                  Or paste image URL
                </span>
                <div className="flex-1 border-t border-cwb-border"></div>
              </div>
              
              <div className="cwb-url-input mt-4 flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  className="cwb-form-input flex-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                  value={config.companyLogo || ''}
                  onChange={(e) => onConfigChange({ companyLogo: e.target.value })}
                />
                <Button 
                  variant="outline" 
                  className="cwb-add-btn border-cwb-border text-cwb-primary hover:bg-cwb-primary hover:text-cwb-primary-foreground"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="cwb-step-navigation flex justify-between items-center mt-8 pt-6 border-t border-cwb-border">
        <Button 
          variant="ghost" 
          className="cwb-nav-btn text-cwb-muted-foreground"
          disabled
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