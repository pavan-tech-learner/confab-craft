import React from 'react';
import { createRoot } from 'react-dom/client';
import { EmbeddableChatWidget } from './components/EmbeddableChatWidget';
import { ConfigService, parseScriptAttributes, parseWindowConfig } from './services/configService';
import { ChatConfig, defaultConfig } from './types/chat-config';

/**
 * Main widget initialization function
 */
async function initializeChatWidget() {
  try {
    console.log('🚀 Initializing Chat Widget...');

    // Parse initialization options from script tag
    const scriptOptions = parseScriptAttributes();
    if (!scriptOptions) {
      console.error('❌ Failed to parse script attributes');
      return;
    }

    // Parse window config if available
    const windowConfig = parseWindowConfig();

    // Merge configurations
    const mergedConfig = {
      ...scriptOptions.config,
      ...windowConfig
    };

    // Update script options with merged config
    const finalOptions = {
      ...scriptOptions,
      config: mergedConfig
    };

    console.log('📋 Widget Options:', finalOptions);

    // Fetch final configuration
    const configService = ConfigService.getInstance();
    const config = await configService.fetchConfig(finalOptions);

    console.log('⚙️ Final Config:', config);

    // Find or create container
    let container: HTMLElement;
    
    if (finalOptions.containerId) {
      const existingContainer = document.getElementById(finalOptions.containerId);
      if (existingContainer) {
        container = existingContainer;
      } else {
        console.warn(`⚠️ Container with ID "${finalOptions.containerId}" not found, creating new container`);
        container = document.createElement('div');
        container.id = finalOptions.containerId;
        document.body.appendChild(container);
      }
    } else {
      // Create default container
      container = document.createElement('div');
      container.id = `chat-widget-${finalOptions.widgetId}`;
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
      `;
      document.body.appendChild(container);
    }

    // Create React root and render widget
    const root = createRoot(container);
    
    root.render(
      <EmbeddableChatWidget
        config={config}
        apiBaseUrl={finalOptions.apiBaseUrl}
        widgetId={finalOptions.widgetId}
        onMessageSent={(message) => {
          console.log('📤 Message sent:', message);
          // Emit custom event for host site integration
          window.dispatchEvent(new CustomEvent('chatWidgetMessageSent', {
            detail: { message, widgetId: finalOptions.widgetId }
          }));
        }}
        onConfigFetched={(fetchedConfig) => {
          console.log('📥 Config fetched:', fetchedConfig);
          // Emit custom event for host site integration
          window.dispatchEvent(new CustomEvent('chatWidgetConfigFetched', {
            detail: { config: fetchedConfig, widgetId: finalOptions.widgetId }
          }));
        }}
      />
    );

    console.log('✅ Chat Widget initialized successfully!');

    // Expose widget API to window for host site integration
    (window as any).ChatWidget = {
      updateConfig: (newConfig: Partial<ChatConfig>) => {
        configService.updateConfig(finalOptions.widgetId, newConfig);
        const updatedConfig = { ...config, ...newConfig };
        root.render(
          <EmbeddableChatWidget
            config={updatedConfig}
            apiBaseUrl={finalOptions.apiBaseUrl}
            widgetId={finalOptions.widgetId}
          />
        );
      },
      getConfig: () => config,
      destroy: () => {
        root.unmount();
        container.remove();
        configService.clearCache(finalOptions.widgetId);
      }
    };

  } catch (error) {
    console.error('❌ Failed to initialize chat widget:', error);
  }
}

/**
 * Auto-initialize when DOM is ready
 */
function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatWidget);
  } else {
    // DOM is already ready
    initializeChatWidget();
  }
}

// Start auto-initialization
autoInit();

// Export for manual initialization if needed
export { initializeChatWidget, EmbeddableChatWidget, ConfigService };
