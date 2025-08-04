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
    <div className="cwb-step-indicator flex items-center justify-center mb-8">
      <div className="flex items-center space-x-1 lg:space-x-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all duration-300
              ${step.completed || currentStep > step.id
                ? 'bg-cwb-primary border-cwb-primary text-cwb-primary-foreground'
                : currentStep === step.id
                ? 'bg-cwb-primary border-cwb-primary text-cwb-primary-foreground ring-2 ring-cwb-primary/20'
                : 'border-cwb-border text-cwb-muted-foreground'
              }
            `}>
              {step.completed || currentStep > step.id ? (
                <Check className="w-4 h-4 lg:w-5 lg:h-5" />
              ) : (
                <span className="cwb-step-icon">{step.icon}</span>
              )}
            </div>
            <div className="ml-1 lg:ml-2 hidden sm:block">
              <div className={`text-xs font-medium ${
                step.completed || currentStep >= step.id ? 'text-cwb-primary' : 'text-cwb-muted-foreground'
              }`}>
                Step {step.id}
              </div>
              <div className={`text-xs ${
                step.completed || currentStep >= step.id ? 'text-cwb-foreground' : 'text-cwb-muted-foreground'
              }`}>
                {step.subtitle}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-3 lg:w-6 h-0.5 mx-1 lg:mx-3 transition-all duration-300 ${
                step.completed || currentStep > step.id ? 'bg-cwb-primary' : 'bg-cwb-border'
              }`} />
            )}
          </div>
        ))}
      </div>
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
    title: 'Business Hours',
    subtitle: 'Business Hours',
    icon: <Settings className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 5,
    title: 'Agent Configuration',
    subtitle: 'Agent Configuration',
    icon: <Settings className="w-5 h-5" />,
    completed: false,
  },
];