import { User, Palette, Info, Settings, Check } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="cwb-step-indicator flex items-center justify-between w-full max-w-4xl mx-auto mb-8 px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="cwb-step-item flex items-center">
          {/* Step Circle */}
          <div className="cwb-step-circle-container flex flex-col items-center">
            <div
              className={`cwb-step-circle w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                step.completed
                  ? 'bg-cwb-success text-cwb-success-foreground'
                  : currentStep === step.id
                  ? 'bg-cwb-primary text-cwb-primary-foreground'
                  : 'bg-cwb-step-background text-cwb-step-pending'
              }`}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="cwb-step-icon">{step.icon}</span>
              )}
            </div>
            
            {/* Step Labels */}
            <div className="cwb-step-labels mt-3 text-center">
              <div className="cwb-step-title text-sm font-medium text-cwb-foreground">
                Step {step.id}
              </div>
              <div className="cwb-step-subtitle text-xs text-cwb-muted-foreground max-w-[120px]">
                {step.subtitle}
              </div>
            </div>
          </div>
          
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="cwb-step-connector flex-1 mx-4">
              <div
                className={`cwb-connector-line h-0.5 transition-all duration-200 ${
                  step.completed
                    ? 'bg-cwb-success'
                    : currentStep > step.id
                    ? 'bg-cwb-primary'
                    : 'bg-cwb-step-background'
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const getSteps = (): Step[] => [
  {
    id: 1,
    title: 'Company & Branding',
    subtitle: 'Company & Branding',
    icon: <User className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 2,
    title: 'Theme & Appearance',
    subtitle: 'Theme & Appearance',
    icon: <Palette className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 3,
    title: 'User Information',
    subtitle: 'User Information',
    icon: <Info className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 4,
    title: 'Agent Configuration',
    subtitle: 'Agent Configuration',
    icon: <Settings className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 5,
    title: 'Business Hours',
    subtitle: 'Business Hours',
    icon: <Settings className="w-5 h-5" />,
    completed: false,
  },
];