import { useState, useEffect } from 'react';
import { StepIndicator, getSteps } from './StepIndicator';
import { ChatPreview } from './ChatPreview';
import { Step1CompanyBranding } from './steps/Step1CompanyBranding';
import { Step2ThemeAppearance } from './steps/Step2ThemeAppearance';
import { Step3UserInformation } from './steps/Step3UserInformation';
import { Step4AgentConfiguration } from './steps/Step4AgentConfiguration';
import { Step5BusinessHours } from './steps/Step5BusinessHours';
import { CompletionStep } from './steps/CompletionStep';
import { ChatConfig, defaultConfig } from '../../types/chat-config';
import { useToast } from '../../hooks/use-toast';

export const ChatWidgetBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ChatConfig>(defaultConfig);
  const [steps, setSteps] = useState(getSteps());
  const { toast } = useToast();

  const handleConfigChange = (updates: Partial<ChatConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      // Mark current step as completed
      setSteps(prev => prev.map(step => 
        step.id === currentStep 
          ? { ...step, completed: true }
          : step
      ));
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Mark all steps as completed
    setSteps(prev => prev.map(step => ({ ...step, completed: true })));
    setCurrentStep(6); // Go to completion screen
  };

  // Get the preview title and subtitle based on current step
  const getPreviewInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Live Preview",
          subtitle: "See your branding changes"
        };
      case 2:
        return {
          title: "Live Preview",
          subtitle: "See theme and appearance changes"
        };
      case 3:
        return {
          title: "Live Preview",
          subtitle: "See user information collection"
        };
      case 4:
        return {
          title: "Live Preview",
          subtitle: "See agent configuration"
        };
      case 5:
        return {
          title: "Live Preview",
          subtitle: "See business hours settings"
        };
      default:
        return {
          title: "Live Preview",
          subtitle: "See your changes"
        };
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1CompanyBranding
            config={config}
            onConfigChange={handleConfigChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2ThemeAppearance
            config={config}
            onConfigChange={handleConfigChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <Step3UserInformation
            config={config}
            onConfigChange={handleConfigChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <Step4AgentConfiguration
            config={config}
            onConfigChange={handleConfigChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <Step5BusinessHours
            config={config}
            onConfigChange={handleConfigChange}
            onFinish={handleFinish}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <CompletionStep
            config={config}
            onRestart={() => {
              setCurrentStep(1);
              setSteps(getSteps());
            }}
          />
        );
      default:
        return null;
    }
  };

  const previewInfo = getPreviewInfo();

  return (
    <div className="cwb-widget-builder min-h-screen bg-cwb-background">
      <div className="cwb-builder-container max-w-6xl mx-auto px-4 py-6">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Main Content */}
        <div className="cwb-builder-content grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className={`cwb-config-panel ${currentStep === 6 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            {renderCurrentStep()}
          </div>

          {/* Preview Panel - Hide on completion step */}
          {currentStep !== 6 && (
            <div className="cwb-preview-panel lg:col-span-1">
              <div className="cwb-preview-sticky sticky top-6">
                <ChatPreview 
                  config={config} 
                  title={previewInfo.title}
                  subtitle={previewInfo.subtitle}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};