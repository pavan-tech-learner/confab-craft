import { ChatWidget } from '../components/chat-widget/ChatWidget';
import { ChatConfig, defaultConfig } from '../types/chat-config';
import { ArrowLeft, Code, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

export default function WidgetPreview() {
  const { toast } = useToast();

  // Get config from localStorage or use default
  const getConfigFromLocalStorage = (): ChatConfig => {
    try {
      const configStr = localStorage.getItem('chatWidgetConfig');
      if (configStr) {
        return { ...defaultConfig, ...JSON.parse(configStr) };
      }
    } catch (error) {
      console.error('Error parsing config from localStorage:', error);
    }
    return defaultConfig;
  };

  const config = getConfigFromLocalStorage();

  const handleGetCode = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">

              <div>
                <h1 className="text-2xl font-bold text-gray-900">Widget Preview</h1>
                <p className="text-gray-600">See how your chat widget will look on your website</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleGetCode}
                className="flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                Get Embed Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Simulated Website */}
          <div className="relative h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Mock Website Content */}
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded"></div>
                          <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Widget */}
            <ChatWidget config={config} />
          </div>
        </div>
      </div>


    </div>
  );
}