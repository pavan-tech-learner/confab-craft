import { ChatConfig, defaultConfig } from '../types/chat-config';

export interface WidgetInitOptions {
  widgetId: string;
  apiBaseUrl?: string;
  containerId?: string;
  config?: Partial<ChatConfig>;
}

export class ConfigService {
  private static instance: ConfigService;
  private cache: Map<string, ChatConfig> = new Map();

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Fetch widget configuration from API or use provided config
   */
  async fetchConfig(options: WidgetInitOptions): Promise<ChatConfig> {
    const { widgetId, apiBaseUrl, config: providedConfig } = options;

    // Check cache first
    if (this.cache.has(widgetId)) {
      return this.cache.get(widgetId)!;
    }

    let fetchedConfig: ChatConfig = defaultConfig;

    // Try to fetch from API if available
    if (apiBaseUrl && widgetId) {
      try {
        const response = await fetch(`${apiBaseUrl}/api/widgets/${widgetId}/config`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          fetchedConfig = { ...defaultConfig, ...data };
          console.log('✅ Widget config fetched from API:', widgetId);
        } else {
          console.warn('⚠️ Failed to fetch widget config from API, using default config');
        }
      } catch (error) {
        console.warn('⚠️ Error fetching widget config:', error);
      }
    }

    // Merge with provided config
    if (providedConfig) {
      fetchedConfig = { ...fetchedConfig, ...providedConfig };
    }

    // Cache the result
    this.cache.set(widgetId, fetchedConfig);

    return fetchedConfig;
  }

  /**
   * Update cached config
   */
  updateConfig(widgetId: string, config: Partial<ChatConfig>): void {
    const existingConfig = this.cache.get(widgetId) || defaultConfig;
    const updatedConfig = { ...existingConfig, ...config };
    this.cache.set(widgetId, updatedConfig);
  }

  /**
   * Clear cache for a specific widget
   */
  clearCache(widgetId: string): void {
    this.cache.delete(widgetId);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }
}

/**
 * Parse widget initialization from script tag attributes
 */
export function parseScriptAttributes(): WidgetInitOptions | null {
  const scripts = document.querySelectorAll('script[data-widget-id]');
  const currentScript = scripts[scripts.length - 1] as HTMLScriptElement;

  if (!currentScript) {
    console.error('❌ Chat widget script tag not found');
    return null;
  }

  const widgetId = currentScript.getAttribute('data-widget-id');
  if (!widgetId) {
    console.error('❌ data-widget-id attribute is required');
    return null;
  }

  const apiBaseUrl = currentScript.getAttribute('data-api-url') || undefined;
  const containerId = currentScript.getAttribute('data-container-id') || undefined;

  // Parse inline config if provided
  let inlineConfig: Partial<ChatConfig> | undefined;
  const configAttr = currentScript.getAttribute('data-config');
  if (configAttr) {
    try {
      inlineConfig = JSON.parse(configAttr);
    } catch (error) {
      console.warn('⚠️ Invalid JSON in data-config attribute:', error);
    }
  }

  return {
    widgetId,
    apiBaseUrl,
    containerId,
    config: inlineConfig
  };
}

/**
 * Parse widget configuration from window object
 */
export function parseWindowConfig(): Partial<ChatConfig> | undefined {
  // Check for global config
  const globalConfig = (window as any).chatWidgetConfig;
  if (globalConfig && typeof globalConfig === 'object') {
    return globalConfig;
  }

  return undefined;
}
