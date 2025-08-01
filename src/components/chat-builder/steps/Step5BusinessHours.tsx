import { Clock, MessageSquare, Timer, WifiOff, MessageSquareX } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Slider } from '../../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ChatConfig } from '../../../types/chat-config';

interface Step5BusinessHoursProps {
  config: ChatConfig;
  onConfigChange: (updates: Partial<ChatConfig>) => void;
  onFinish: () => void;
  onPrevious: () => void;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

export const Step5BusinessHours = ({
  config,
  onConfigChange,
  onFinish,
  onPrevious
}: Step5BusinessHoursProps) => {
  const handleBusinessHoursToggle = (enabled: boolean) => {
    onConfigChange({
      businessHours: {
        ...config.businessHours,
        enabled
      }
    });
  };

  const handleTimezoneChange = (timezone: string) => {
    onConfigChange({
      businessHours: {
        ...config.businessHours,
        timezone
      }
    });
  };

  const handleDayToggle = (day: typeof days[number], enabled: boolean) => {
    onConfigChange({
      businessHours: {
        ...config.businessHours,
        schedule: {
          ...config.businessHours.schedule,
          [day]: {
            ...config.businessHours.schedule[day],
            enabled
          }
        }
      }
    });
  };

  const handleTimeChange = (day: typeof days[number], field: 'startTime' | 'endTime', value: string) => {
    onConfigChange({
      businessHours: {
        ...config.businessHours,
        schedule: {
          ...config.businessHours.schedule,
          [day]: {
            ...config.businessHours.schedule[day],
            [field]: value
          }
        }
      }
    });
  };

  const handleDisconnectToggle = (enabled: boolean) => {
    onConfigChange({
      disconnectSettings: {
        ...config.disconnectSettings,
        enabled
      }
    });
  };

  const handleDisconnectChange = (field: keyof ChatConfig['disconnectSettings'], value: any) => {
    onConfigChange({
      disconnectSettings: {
        ...config.disconnectSettings,
        [field]: value
      }
    });
  };

  return (
    <div className="cwb-step5-container bg-cwb-card rounded-lg p-6">
      <div className="cwb-step5-header mb-6">
        <div className="cwb-section-icon mb-4">
          <div className="cwb-icon-circle w-12 h-12 bg-cwb-primary/10 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-cwb-primary" />
          </div>
        </div>
        <h2 className="cwb-section-title text-xl font-semibold text-cwb-foreground mb-2">
          Business Hours & Settings
        </h2>
        <p className="cwb-section-subtitle text-cwb-muted-foreground">
          Configure when your chat is available and disconnection settings
        </p>
      </div>

      <div className="cwb-form-content space-y-6">
        {/* Business Hours Section */}
        <div className="cwb-form-section">
          <div className="cwb-switch-field flex items-center justify-between p-4 bg-cwb-muted/30 rounded-lg mb-4">
            <div className="cwb-switch-label">
              <Label className="text-sm font-medium text-cwb-foreground">
                Enable Business Hours
              </Label>
              <p className="text-xs text-cwb-muted-foreground mt-1">
                Restrict chat availability to specific hours
              </p>
            </div>
            <Switch
              checked={config.businessHours.enabled}
              onCheckedChange={handleBusinessHoursToggle}
            />
          </div>

          {config.businessHours.enabled && (
            <div className="cwb-business-hours-config space-y-4">
              <div className="cwb-form-field">
                <Label className="cwb-field-label text-sm font-medium text-cwb-foreground">
                  Timezone
                </Label>
                <Select value={config.businessHours.timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger className="cwb-form-select mt-1 border-cwb-input-border">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="cwb-schedule-grid space-y-3">
                <Label className="cwb-field-label text-sm font-medium text-cwb-foreground">
                  Weekly Schedule
                </Label>
                {days.map((day, index) => (
                  <div key={day} className="cwb-day-schedule flex items-center space-x-4 p-3 border border-cwb-border rounded-lg">
                    <div className="cwb-day-toggle">
                      <Switch
                        checked={config.businessHours.schedule[day].enabled}
                        onCheckedChange={(enabled) => handleDayToggle(day, enabled)}
                      />
                    </div>
                    <div className="cwb-day-label w-20 text-sm font-medium text-cwb-foreground">
                      {dayLabels[index]}
                    </div>
                    {config.businessHours.schedule[day].enabled && (
                      <div className="cwb-time-inputs flex items-center space-x-2 flex-1">
                        <Input
                          type="time"
                          value={config.businessHours.schedule[day].startTime}
                          onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          className="cwb-time-input border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                        />
                        <span className="text-cwb-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={config.businessHours.schedule[day].endTime}
                          onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          className="cwb-time-input border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                        />
                      </div>
                    )}
                    {!config.businessHours.schedule[day].enabled && (
                      <div className="cwb-day-closed flex-1 text-sm text-cwb-muted-foreground">
                        Closed
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="cwb-form-field">
                <Label className="cwb-field-label text-sm font-medium text-cwb-foreground">
                  Outside Hours Message
                </Label>
                <Textarea
                  value={config.businessHours.outsideHoursMessage}
                  onChange={(e) => onConfigChange({
                    businessHours: {
                      ...config.businessHours,
                      outsideHoursMessage: e.target.value
                    }
                  })}
                  className="cwb-form-textarea mt-1 border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                  placeholder="We're currently offline. Please leave a message..."
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Disconnect Settings */}
        <div className="cwb-form-section space-y-6">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-cwb-primary" />
            <Label className="text-lg font-semibold text-cwb-foreground">Auto Disconnect</Label>
          </div>

          <div className="flex items-center justify-between p-4 border border-cwb-border rounded-lg">
            <div>
              <Label className="text-sm font-medium text-cwb-foreground">Enable Auto Disconnect</Label>
              <p className="text-xs text-cwb-muted-foreground">Disconnect users after inactivity period</p>
            </div>
            <Switch
              checked={config.disconnectSettings.enabled}
              onCheckedChange={handleDisconnectToggle}
            />
          </div>

          {config.disconnectSettings.enabled && (
            <div className="space-y-4">
              {/* Timeout Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2 text-cwb-foreground">
                    <Timer className="w-4 h-4 text-cwb-primary" />
                    Inactivity Timeout
                  </Label>
                  <span className="text-sm font-semibold text-cwb-primary">
                    {config.disconnectSettings.inactivityTimeoutMinutes} minutes
                  </span>
                </div>
                
                <Slider
                  value={[config.disconnectSettings.inactivityTimeoutMinutes]}
                  onValueChange={(value) => handleDisconnectChange('inactivityTimeoutMinutes', value[0])}
                  max={60}
                  min={1}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-cwb-muted-foreground">
                  <span>1 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Disconnect Message */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2 text-cwb-foreground">
                  <MessageSquareX className="w-4 h-4 text-cwb-primary" />
                  Disconnect Message
                </Label>
                <Textarea
                  value={config.disconnectSettings.disconnectMessage}
                  onChange={(e) => handleDisconnectChange('disconnectMessage', e.target.value)}
                  placeholder="You've been disconnected due to inactivity..."
                  className="min-h-[60px] text-sm border-cwb-input-border focus:border-cwb-primary focus:ring-cwb-primary"
                />
              </div>

              {/* Reconnect Button */}
              <div className="flex items-center justify-between p-4 border border-cwb-border rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-cwb-foreground">Show Reconnect Button</Label>
                  <p className="text-xs text-cwb-muted-foreground">Allow quick reconnection</p>
                </div>
                <Switch
                  checked={config.disconnectSettings.showReconnectButton}
                  onCheckedChange={(checked) => handleDisconnectChange('showReconnectButton', checked)}
                />
              </div>
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
          onClick={onFinish}
          className="cwb-nav-btn bg-cwb-success text-cwb-success-foreground hover:bg-cwb-success/90"
        >
          Finish Configuration
        </Button>
      </div>
    </div>
  );
};