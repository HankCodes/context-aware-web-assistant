// Main component (all-in-one)
export { default as AIAssistant } from './AIAssistant';

// Context Provider and Hook
export { AIAssistantProvider, useAIAssistant } from './AIAssistantContext';

// Individual components (for custom layouts)
export { default as ComponentArea } from './components/ComponentArea/ComponentArea';
export { ChatBubble, ChatDrawer } from './components/AIChat';

// Services
export { sendChatMessage, checkHealth } from './services/chatService';

// Tools and tool configuration
export * from './components/AIToolComponents';
export { executeToolCall, getToolRenderer, getToolRenderLocation } from './tools/toolHandler';
export { toolsConfig, registerTool } from './tools/toolsConfig';