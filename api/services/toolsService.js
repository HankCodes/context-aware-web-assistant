/**
 * Tool definitions for the AI agent.
 * These are SCHEMA ONLY - no implementations.
 * The agent uses these to decide which tools to call.
 * The frontend will execute the actual tool calls.
 */

const tools = [
  {
    name: 'getCurrentTime',
    description: 'Get the current date and time. ONLY use this tool when the user explicitly asks about time, date, or "what time is it". Do NOT use for general questions, greetings, or unrelated queries.',
    schema: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description: 'Optional timezone (e.g., "America/New_York", "Europe/Oslo"). Defaults to UTC if not provided.',
        },
      },
      required: [],
    },
  },
  {
    name: 'getSampleData',
    description: 'Get sample data items for demonstration purposes. Use this when the user asks to see sample data, demo data, or example items. Supports optional category filtering.',
    schema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category to filter items (e.g., "books", "products", "services"). If not provided, returns all items.',
        },
      },
      required: [],
    },
  },
  {
    name: 'updateProfileContext',
    description: 'Opens a form so the user can fill in or update their profile/context information (experience level, interests, use case). Use this ONLY when the user explicitly asks to update their profile, context, or tell you more about themselves.',
    schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'getSampleDataCount',
    description:
      "Answers a factual question about the sample data (e.g. \"how many sample items are there?\", \"how many books do you have?\") by counting real items instead of guessing. This tool's result is NOT shown to the user directly - it is sent back to you afterward so you can compose the actual answer yourself in a follow-up reply (see the 'answer' render location in the frontend's toolsConfig.js). Never estimate a count yourself when this tool can fetch the real one.",
    schema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category to count (e.g., "books", "products", "services"). If not provided, counts all items.',
        },
      },
      required: [],
    },
  },
];

/**
 * Converts tool definitions to Anthropic's native tool format.
 * Used for the Claude provider (and Ollama, which also accepts this shape).
 */
function convertToLangChainTools() {
  return tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.schema,
  }));
}

/**
 * Converts tool definitions to the OpenAI Chat Completions tool format
 * (`{ type: "function", function: { name, description, parameters } }`).
 * Used for any OpenAI-compatible provider, e.g. LM Studio.
 */
function convertToOpenAITools() {
  return tools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.schema,
    },
  }));
}

export {
  tools,
  convertToLangChainTools,
  convertToOpenAITools,
};
