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
];

/**
 * Converts tool definitions to LangChain tool format
 */
function convertToLangChainTools() {
  return tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.schema,
  }));
}

export {
  tools,
  convertToLangChainTools,
};
