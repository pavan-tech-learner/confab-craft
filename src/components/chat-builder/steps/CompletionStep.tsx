import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Check, Eye, RotateCcw, Download, Code } from 'lucide-react';
import { ChatConfig } from '../../../types/chat-config';
import { useToast } from '../../../hooks/use-toast';

interface CompletionStepProps {
  config: ChatConfig;
  onRestart: () => void;
}

export const CompletionStep = ({ config, onRestart }: CompletionStepProps) => {
  const { toast } = useToast();

  const handleViewWidget = () => {
    // Create URL with config data
    const configParam = encodeURIComponent(JSON.stringify(config));
    const url = `/widget-preview?config=${configParam}`;
    window.open(url, '_blank');
  };

  const handleDownloadConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chat-widget-config.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Config Downloaded!",
      description: "Your widget configuration has been downloaded.",
    });
  };

  const handleGetEmbedCode = () => {
    const embedCode = `<!-- Chat Widget Embed Code -->
<div id="chat-widget-container"></div>
<script>
  window.chatWidgetConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://your-domain.com/chat-widget.js"></script>`;

    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Code Copied!",
      description: "The embed code has been copied to your clipboard.",
    });
  };

  return (
    <Card className="cwb-completion-card w-full max-w-4xl mx-auto">
      <CardContent className="cwb-completion-content p-8">
        <div className="cwb-completion-inner text-center space-y-8">
          {/* Success Icon */}
          <div className="cwb-success-icon-container flex justify-center">
            <div className="cwb-success-icon w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="cwb-completion-text space-y-4">
            <h2 className="cwb-completion-title text-3xl md:text-4xl font-bold text-cwb-foreground">
              Configuration Complete!
            </h2>
            <p className="cwb-completion-description text-cwb-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Your chat widget has been successfully configured with all your custom settings and preferences. 
              Your widget is now ready to be deployed on your website.
            </p>
          </div>

          {/* Configuration Summary */}
          <div className="cwb-config-summary bg-cwb-muted rounded-lg p-6 text-left max-w-2xl mx-auto">
            <h3 className="cwb-summary-title text-lg font-semibold text-cwb-foreground mb-4">Configuration Summary</h3>
            <div className="cwb-summary-grid grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="cwb-summary-item">
                <span className="cwb-summary-label font-medium text-cwb-muted-foreground">Company:</span>
                <span className="cwb-summary-value ml-2 text-cwb-foreground">{config.companyName}</span>
              </div>
              <div className="cwb-summary-item">
                <span className="cwb-summary-label font-medium text-cwb-muted-foreground">Agent:</span>
                <span className="cwb-summary-value ml-2 text-cwb-foreground">{config.agentName}</span>
              </div>
              <div className="cwb-summary-item">
                <span className="cwb-summary-label font-medium text-cwb-muted-foreground">Position:</span>
                <span className="cwb-summary-value ml-2 text-cwb-foreground capitalize">{config.position.replace('-', ' ')}</span>
              </div>
              <div className="cwb-summary-item">
                <span className="cwb-summary-label font-medium text-cwb-muted-foreground">Theme:</span>
                <span className="cwb-summary-value ml-2 text-cwb-foreground flex items-center gap-2">
                  {config.themeColor}
                  <div 
                    className="w-4 h-4 rounded border border-cwb-border"
                    style={{ backgroundColor: config.themeColor }}
                  ></div>
                </span>
              </div>
              <div className="cwb-summary-item">
                <span className="cwb-summary-label font-medium text-cwb-muted-foreground">User Info Required:</span>
                <span className="cwb-summary-value ml-2 text-cwb-foreground">{config.requireUserInfo ? 'Yes' : 'No'}</span>
              </div>
              <div className="cwb-summary-item">
                <span className="cwb-summary-label font-medium text-cwb-muted-foreground">Agent Type:</span>
                <span className="cwb-summary-value ml-2 text-cwb-foreground capitalize">{config.agentType}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cwb-action-buttons space-y-6">
            <div className="cwb-ready-text text-sm text-cwb-muted-foreground font-medium">
              Ready to see your widget in action?
            </div>

            <div className="cwb-primary-actions flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleViewWidget}
                className="cwb-view-widget-btn w-full sm:w-auto bg-gradient-to-r from-cwb-primary to-cwb-primary-glow hover:from-cwb-primary-glow hover:to-cwb-primary text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Your Widget
              </Button>

              <Button
                variant="outline"
                onClick={onRestart}
                className="cwb-edit-config-btn w-full sm:w-auto border-2 border-cwb-border hover:border-cwb-primary hover:text-cwb-primary font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Edit Configuration
              </Button>
            </div>

            <div className="cwb-secondary-actions flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                variant="secondary"
                onClick={handleDownloadConfig}
                className="cwb-download-btn w-full sm:w-auto"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Config
              </Button>

              <Button
                variant="secondary"
                onClick={handleGetEmbedCode}
                className="cwb-embed-btn w-full sm:w-auto"
                size="sm"
              >
                <Code className="w-4 h-4 mr-2" />
                Get Embed Code
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};