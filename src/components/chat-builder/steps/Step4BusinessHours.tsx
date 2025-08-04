import { Clock, MessageSquare, Timer, WifiOff, MessageSquareX } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ChatConfig } from '../../../types/chat-config';

interface Step4BusinessHoursProps {
  config: ChatConfig;
  onConfigChange: (updates: Partial<ChatConfig>) => void;
  onNext: () => void;
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

export const Step4BusinessHours = ({
  config,
  onConfigChange,
  onNext,
  onPrevious
}: Step4BusinessHoursProps) => {
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

  const handleOutsideHoursMessageChange = (outsideHoursMessage: string) => {
    onConfigChange({
      businessHours: {
        ...config.businessHours,
        outsideHoursMessage
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

  const handleInactivityTimeoutChange = (minutes: number[]) => {
    onConfigChange({
      disconnectSettings: {
        ...config.disconnectSettings,
        inactivityTimeoutMinutes: minutes[0]
      }
    });
  };

  const handleDisconnectMessageChange = (disconnectMessage: string) => {
    onConfigChange({
      disconnectSettings: {
        ...config.disconnectSettings,
        disconnectMessage
      }
    });
  };

  const handleReconnectButtonToggle = (showReconnectButton: boolean) => {
    onConfigChange({
      disconnectSettings: {
        ...config.disconnectSettings,
        showReconnectButton
      }
    });
  };

  return (
    <div className="cwb-step4-container bg-cwb-card rounded-lg p-6">
      <div className="cwb-step4-header mb-6">
        <div className="cwb-section-icon mb-4">
          <div className="cwb-icon-circle w-12 h-12 bg-cwb-primary/10 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-cwb-primary" />
          </div>
        </div>
        <h2 className="cwb-section-title text-xl font-semibold text-cwb-foreground mb-2">
          Business Hours & Availability
        </h2>
        <p className="cwb-section-subtitle text-cwb-muted-foreground">
          Configure when your chat widget is available and handle offline scenarios
        </p>
      </div>

      <div className="cwb-step4-content space-y-8">
        {/* Business Hours Configuration */}
        <div className="cwb-business-hours-section">
          <div className="cwb-section-header flex items-center justify-between mb-4">
            <div className="cwb-section-info">
              <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-cwb-primary" />
                Business Hours
              </h3>
              <p className="cwb-section-description text-sm text-cwb-muted-foreground">
                Set your availability schedule
              </p>
            </div>
            <Switch
              checked={config.businessHours.enabled}
              onCheckedChange={handleBusinessHoursToggle}
            />
          </div>

          {config.businessHours.enabled && (
            <div className="cwb-business-hours-config space-y-6 p-4 bg-cwb-muted/20 rounded-lg">
              {/* Timezone Selection */}
              <div className="cwb-timezone-section">
                <Label htmlFor="timezone" className="cwb-label text-sm font-medium text-cwb-foreground">
                  Timezone
                </Label>
                <Select value={config.businessHours.timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger className="cwb-select-trigger">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weekly Schedule */}
              <div className="cwb-schedule-section">
                <Label className="cwb-label text-sm font-medium text-cwb-foreground mb-3 block">
                  Weekly Schedule
                </Label>
                <div className="cwb-schedule-grid space-y-3">
                  {days.map((day, index) => (
                    <div key={day} className="cwb-day-config flex items-center gap-4 p-3 bg-cwb-background rounded-md">
                      <div className="cwb-day-toggle flex items-center gap-2 min-w-[120px]">
                        <Switch
                          checked={config.businessHours.schedule[day].enabled}
                          onCheckedChange={(enabled) => handleDayToggle(day, enabled)}
                        />
                        <span className="cwb-day-label text-sm font-medium text-cwb-foreground">
                          {dayLabels[index]}
                        </span>
                      </div>
                      {config.businessHours.schedule[day].enabled && (
                        <div className="cwb-time-inputs flex items-center gap-2 flex-1">
                          <Input
                            type="time"
                            value={config.businessHours.schedule[day].startTime}
                            onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                            className="cwb-time-input"
                          />
                          <span className="cwb-time-separator text-cwb-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={config.businessHours.schedule[day].endTime}
                            onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                            className="cwb-time-input"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Outside Hours Message */}
              <div className="cwb-outside-hours-section">
                <Label htmlFor="outsideHoursMessage" className="cwb-label text-sm font-medium text-cwb-foreground">
                  Outside Hours Message
                </Label>
                <Textarea
                  id="outsideHoursMessage"
                  value={config.businessHours.outsideHoursMessage}
                  onChange={(e) => handleOutsideHoursMessageChange(e.target.value)}
                  placeholder="Message to show when outside business hours"
                  className="cwb-textarea"
                />
              </div>
            </div>
          )}
        </div>

        {/* Auto-Disconnect Settings */}
        <div className="cwb-disconnect-section">
          <div className="cwb-section-header flex items-center justify-between mb-4">
            <div className="cwb-section-info">
              <h3 className="cwb-section-title text-lg font-medium text-cwb-foreground flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-cwb-primary" />
                Auto-Disconnect
              </h3>
              <p className="cwb-section-description text-sm text-cwb-muted-foreground">
                Automatically disconnect inactive users
              </p>
            </div>
            <Switch
              checked={config.disconnectSettings.enabled}
              onCheckedChange={handleDisconnectToggle}
            />
          </div>

          {config.disconnectSettings.enabled && (
            <div className="cwb-disconnect-config space-y-6 p-4 bg-cwb-muted/20 rounded-lg">
              {/* Inactivity Timeout */}
              <div className="cwb-timeout-section">
                <Label htmlFor="inactivityTimeout" className="cwb-label text-sm font-medium text-cwb-foreground">
                  Inactivity Timeout (minutes)
                </Label>
                <Input
                  id="inactivityTimeout"
                  type="number"
                  min="1"
                  value={config.disconnectSettings.inactivityTimeoutMinutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || parseInt(value) >= 1) {
                      handleInactivityTimeoutChange([parseInt(value) || 1]);
                    }
                  }}
                  placeholder="15"
                  className="cwb-input"
                />
                <p className="cwb-help-text text-xs text-cwb-muted-foreground mt-1">
                  Time in minutes before disconnecting inactive users (minimum 1 minute)
                </p>
              </div>

              {/* Disconnect Message */}
              <div className="cwb-disconnect-message-section">
                <Label htmlFor="disconnectMessage" className="cwb-label text-sm font-medium text-cwb-foreground">
                  Disconnect Message
                </Label>
                <Textarea
                  id="disconnectMessage"
                  value={config.disconnectSettings.disconnectMessage}
                  onChange={(e) => handleDisconnectMessageChange(e.target.value)}
                  placeholder="Message to show when user is disconnected"
                  className="cwb-textarea"
                />
              </div>

              {/* Show Reconnect Button */}
              <div className="cwb-reconnect-section flex items-center justify-between">
                <div className="cwb-reconnect-info">
                  <Label className="cwb-label text-sm font-medium text-cwb-foreground">
                    Show Reconnect Button
                  </Label>
                  <p className="cwb-description text-xs text-cwb-muted-foreground">
                    Allow users to reconnect after being disconnected
                  </p>
                </div>
                <Switch
                  checked={config.disconnectSettings.showReconnectButton}
                  onCheckedChange={handleReconnectButtonToggle}
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
          onClick={onNext}
          className="cwb-nav-btn bg-cwb-primary text-cwb-primary-foreground hover:bg-cwb-primary-dark"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
