# AI Assistant for React

**Add a powerful, context-aware AI assistant to your React app in minutes.**

Drop in a portable AI component that knows what page your users are on, what data they're viewing, and can execute custom actions in your app. Your users chat with AI, and your app comes alive with intelligent interactions. But don't worry you are in control of what capabilities the assistant will have.

## What Your Users Get

- **Natural Conversations**: Chat with your app instead of clicking through menus
- **Context Awareness**: AI knows what page they're on and what they're doing
- **Smart Actions**: AI can fetch data, update UI, trigger workflows - anything you enable
- **Live Updates**: Results appear instantly in the chat or directly on the page

## What You Get as a Developer

- **Easy Integration**: Copy one directory, wrap your app, done
- **Zero Backend Changes**: Your existing APIs work as-is, no MCP wrappers for your backed is needed
- **Simple Tool System**: Define what AI can do, you have control of behavior and data visible to the AI
- **Full Control**: Choose Claude or Ollama, customize everything, own your data

---

## How It Works

This isn't a chatbot widget. It's a **tool-based AI system** that executes real functions you define in your app.

```
User: "Show me today's sales data"
  ↓
AI decides to call: getSalesData(date: "today")
  ↓
Your frontend fetches from YOUR existing API
  ↓
Result renders as a chart on the page
```

**Three Core Concepts:**

1. **Context** - You tell the AI where users are and what they're doing using a React hook
2. **Tools** - You define JavaScript functions the AI can call
3. **Rendering** - Results show in chat or in a predefined area on the page

---

## Quick Start

### 1. Install Dependencies

```bash
# Frontend
cd web
npm install

# Backend (standalone AI service)
cd ../api
npm install
```

### 2. Configure AI Provider

**Option A: Claude (Best tool-calling, requires API key)**

```bash
# api/.env
AI_PROVIDER=claude
CLAUDE_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

Get your API key: https://console.anthropic.com/

**Option B: Ollama (Free, local, tool-calling limitations)**

```bash
# api/.env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Install Ollama: https://ollama.ai/

⚠️ **Note**: Ollama has limited tool-calling capabilities compared to Claude. Some complex interactions may not work as expected.

### 3. Start the Services

```bash
# Terminal 1: Start AI backend
cd api
npm start

# Terminal 2: Start your React app
cd web
npm start
```

That's it! Go to `http://localhost:3000`, click the chat bubble in the bottom-right corner and explore the AI Agent in action.

### 4. Try It & Get Help Integrating

The demo app is an interactive tutorial. **Ask the AI assistant to help you integrate it into your own app:**

- "How do I add this to my existing React app?"
- "Show me how to create a custom tool"
- "Explain the architecture"

The AI knows the application and can guide you through integration, customization, and how to use it in your code.

---

## Integrating Into Your App

### 1. Copy the Frontend Component

Copy the `web/src/ai-assistant/` directory into your React app:

```bash
cp -r web/src/ai-assistant your-app/src/
```

### 2. Wrap Your App

```javascript
import { AIAssistantProvider, AIAssistant } from "./ai-assistant";

function App() {
  return (
    <AIAssistantProvider>
      <YourApp />
      <AIAssistant />
    </AIAssistantProvider>
  );
}
```

### 3. Start the AI Backend

Start the `api/` directory as a separate service (Node.js). Point your frontend to it via `REACT_APP_API_URL` (if you do not use the default).

That's it! The `ai-assistant` directory is completely self-contained and portable.

---

## Architecture (Keep It Simple)

**This AI Assistant includes its own chat backend.** You need to run both:

### 1. AI Chat Backend (Included)

- Node.js + Express + LangChain service
- Handles AI chat and decides which tools to call
- Returns tool calls to frontend (doesn't execute them)
- **You run this alongside your existing backend**

### 2. Frontend Component (Included)

- Drop-in React component with UI
- Receives tool calls from AI backend
- **Executes tools in browser** - calls YOUR existing backend APIs
- Renders results in your UI

**Key Point:** The AI backend only handles chat. Your backend handles your business logic. No integration between them - the frontend bridges both.

### Boilerplate, Not a Framework

This is **starter code** to get you going quickly. The implementation is bare bones and simple by design. Feel free to modify it to fit your project.

- Change the architecture
- Add auth
- Add Agent guardrails
- Add your own patterns
- Make it fit your needs

Treat it as a reference implementation, not a rigid framework.

---

## Adding Your First Tool

Adding a tool requires 3 steps: define the schema for the AI, implement the executor, and create the UI component.

**1. Define the tool schema** - Add to the `tools` array in `api/services/toolsService.js`:

```javascript
const tools = [
  // ... existing tools ...
  {
    name: "getWeather",
    description: "Get weather for a city",
    schema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name",
        },
      },
      required: ["city"],
    },
  },
];
```

**2. Create the UI component** - Create `web/src/ai-assistant/components/AIToolComponents/WeatherDisplay.js`:

```javascript
function WeatherDisplay({ data }) {
  return (
    <div className="weather-display">
      <h3>{data.city}</h3>
      <p>{data.temperature}°C</p>
      <p>{data.conditions}</p>
    </div>
  );
}

export default WeatherDisplay;
```

**3. Implement the executor** - Add to `toolsConfig` object in `web/src/ai-assistant/tools/toolsConfig.js`:

```javascript
import WeatherDisplay from "../components/AIToolComponents/WeatherDisplay";

export const toolsConfig = {
  // ... existing tools ...
  getWeather: {
    executor: async ({ city }) => {
      // Call YOUR existing API
      const res = await fetch(`https://your-api.com/weather?city=${city}`);
      return await res.json();
    },
    component: WeatherDisplay,
    renderLocation: "drawer", // Renders inside chat, available values are drawer and component-area
  },
};
```

Done! Users can now ask: "What's the weather in Tokyo?"

---

## Core Features

### Context Awareness

Components send context automatically to the AI:

```javascript
function ProductsPage() {
  const { setContext } = useAIAssistant();

  useEffect(() => {
    setContext({
      page: "products",
      category: selectedCategory,
      userRole: "admin",
    });
  }, [selectedCategory]);

  return <div>Your products page</div>;
}
```

Now the AI knows where users are and can respond contextually.

### Two Rendering Locations

**Drawer** - Small components in the chat sidebar:

```javascript
renderLocation: "drawer"; // Timestamps, quick info, notifications
```

**Component Area** - Large visualizations on the main page:

```javascript
renderLocation: "component-area"; // Charts, tables, data grids
```

This needs the `ComnponentArea` component in your app.

### Agent-Initiated Messages

Your app can start conversations:

```javascript
const { sendAgentMessage } = useAIAssistant();

// When background job completes
sendAgentMessage("Your report is ready!", {
  title: "Report Complete",
  reportId: 123,
});
```

---

## Customization

### Custom System Prompts

Create `api/prompts/custom.md`:

```markdown
You are a helpful assistant for an e-commerce platform.
Focus on helping users find products and track orders.

## Current Context

{{context}}
```

Then set `SYSTEM_PROMPT=custom` in `.env`.

---

## Examples

### Example 1: Data Fetching Tool

```javascript
// Backend tool definition
{
  name: "getUserOrders",
  description: "Get user's order history",
  parameters: {
    userId: { type: "string" }
  }
}

// Frontend implementation
getUserOrders: {
  executor: async ({ userId }) => {
    const res = await fetch(`/api/orders?userId=${userId}`);
    return await res.json();
  },
  component: OrdersList,
  renderLocation: 'component-area'
}
```

User asks: "Show my orders" → AI sees `userId` in context → Calls tool → Displays orders

### Example 2: Pure Frontend Tool

Tools don't need backend APIs, they can be plain functions without side effects:

```javascript
calculateTotal: {
  executor: async ({ items }) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return { total, itemCount: items.length };
  },
  component: TotalDisplay,
  renderLocation: 'drawer'
}
```

### Example 3: Dynamic Tool Registration

Register tools at runtime:

```javascript
import { registerTool } from "./ai-assistant";

registerTool("customAction", {
  executor: async (params) => {
    /* ... */
  },
  component: CustomComponent,
  renderLocation: "drawer",
});
```

---

## Why This Architecture?

**Simple Integration**: No complex backend changes. Your APIs stay unchanged.

**Full Control**: Run Claude or Ollama. Host anywhere. Own your data.

**Flexible Tools**: Tools can call APIs, do calculations, update state - anything.

**Progressive Enhancement**: Start simple, add complexity as needed.

**Framework Agnostic Backend**: Use the AI backend with Vue, Angular, or vanilla JS.

---

## Configuration Reference

### Environment Variables

```bash
# AI Provider
AI_PROVIDER=ollama          # or 'claude'

# Claude Settings
CLAUDE_API_KEY=sk-xxx       # Required if AI_PROVIDER=claude
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Ollama Settings
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2       # or llama3.1, mistral, etc.

# Prompt Settings
SYSTEM_PROMPT=default       # Filename in api/prompts/ (without .md)
ASSISTANT_NAME=AI Assistant

# Server
PORT=8080
```

### Available Context Methods

```javascript
const {
  setContext, // Merge with existing context
  clearContext, // Clear all context
  replaceContext, // Replace entire context
  context, // Read current context
} = useAIAssistant();
```

### Available State Methods

```javascript
const {
  componentAreaTools, // Tools rendering in component area
  drawerTools, // Tools rendering in drawer
  removeToolResult, // Remove a tool result
  agentMessages, // Agent-initiated messages
  hasUnreadAgentMessages,
  markAgentMessagesAsRead,
  clearAgentMessages,
  sendAgentMessage, // Send message as agent
} = useAIAssistant();
```

---

## FAQ

**Q: Wait, so I need TWO backends?**
A: Yes. This AI Assistant includes a chat backend (Node.js) that you deploy alongside your existing backend. They don't talk to each other - your frontend bridges them.

**Q: Do I need to change my existing backend?**
A: No! The AI backend returns tool calls to your frontend. Your frontend executes those calls against your existing APIs. Zero backend changes.

**Q: How does the tool flow work?**
A: AI backend says "call getTool(params)" → Frontend receives this → Frontend calls `fetch('your-api.com/endpoint')` → Your backend responds → Frontend renders.

**Q: Can I use this without Claude API?**
A: Yes, use Ollama (local, free), but tool-calling has limitations.

**Q: Can I deploy this in production?**
A: This is starter code/boilerplate. Review, modify, and secure it for your needs before production use.

**Q: How do I add authentication?**
A: Tools execute in your frontend with your existing auth. Add auth to the AI backend API separately (recommended).

**Q: What about data privacy?**
A: You control what context gets sent to AI providers. Supports Ollama for local/private deployment.
