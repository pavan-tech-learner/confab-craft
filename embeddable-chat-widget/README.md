# Embeddable Chat Widget

A professional, embeddable chat widget that can be integrated into any website with complete CSS isolation and zero conflicts.

## 🚀 Features

- **Complete CSS Isolation** - All classes use `cwb-` prefix to prevent conflicts
- **Professional Design** - Modern UI with animations, typing indicators, and message status
- **Responsive** - Works perfectly on all devices and screen sizes
- **Easy Integration** - Simple script tag integration
- **API Support** - Fetch configuration and send messages via API
- **Customizable** - Extensive theming and branding options
- **Zero Dependencies** - Self-contained with React bundled

## 📦 Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build embeddable widget
npm run build:widget
```

## 🔧 Integration

### Basic Integration

Add this script tag to any website:

```html
<script 
  src="https://your-domain.com/chat-widget.js"
  data-widget-id="your-widget-id"
></script>
```

### Advanced Integration

```html
<script 
  src="https://your-domain.com/chat-widget.js"
  data-widget-id="your-widget-id"
  data-api-url="https://your-api.com"
  data-container-id="custom-chat-container"
  data-config='{"themeColor": "#6366f1", "companyName": "Your Company"}'
></script>
```

### Configuration via Window Object

```html
<script>
  window.chatWidgetConfig = {
    themeColor: '#6366f1',
    companyName: 'Your Company',
    welcomeMessage: 'Hello! How can we help you?',
    position: 'bottom-right'
  };
</script>
<script src="https://your-domain.com/chat-widget.js" data-widget-id="your-widget-id"></script>
```

## ⚙️ Configuration Options

```typescript
interface ChatConfig {
  themeColor: string;
  welcomeMessage: string;
  companyName: string;
  agentName: string;
  companyLogo?: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showUserStatus: boolean;
  showMessageStatus: boolean;
  showAgentIcon: boolean;
  chatIcon: 'message-circle' | 'message-square' | 'phone' | 'headphones' | 'help-circle' | 'mail';
  showChatPrompt: boolean;
  chatPromptMessage: string;
  requireUserInfo: boolean;
  requiredFields: {
    name: boolean;
    email: boolean;
    phone: boolean;
  };
  // ... and many more options
}
```

## 🎨 CSS Isolation

All CSS classes use the `cwb-` prefix to ensure complete isolation:

- `cwb-chat-widget` - Main widget container
- `cwb-chat-button` - Chat button
- `cwb-chat-window` - Chat window
- `cwb-message` - Message containers
- `cwb-input-area` - Input area
- And 100+ more isolated classes

## 📡 API Integration

### Fetch Widget Configuration

```
GET /api/widgets/{widgetId}/config
```

### Send Message

```
POST /api/chat/{widgetId}/message
Content-Type: application/json

{
  "message": "Hello!",
  "userInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🔌 Host Site Integration

### Events

The widget emits custom events for host site integration:

```javascript
// Listen for messages
window.addEventListener('chatWidgetMessageSent', (event) => {
  console.log('Message sent:', event.detail.message);
});

// Listen for config updates
window.addEventListener('chatWidgetConfigFetched', (event) => {
  console.log('Config loaded:', event.detail.config);
});
```

### Widget API

Access the widget programmatically:

```javascript
// Update configuration
window.ChatWidget.updateConfig({
  themeColor: '#ff6b6b',
  companyName: 'New Company Name'
});

// Get current configuration
const config = window.ChatWidget.getConfig();

// Destroy widget
window.ChatWidget.destroy();
```

## 🏗️ Build Output

- `dist/chat-widget.js` - Embeddable widget (UMD format)
- `dist/chat-widget.css` - Widget styles (if separate CSS is needed)

## 🔒 Security

- All user inputs are sanitized
- XSS protection built-in
- CORS-compliant API requests
- No external dependencies loaded

## 📱 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details
