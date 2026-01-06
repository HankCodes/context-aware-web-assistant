import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AIAgentService {
  constructor(llmProvider, config) {
    this.llm = llmProvider;
    this.config = config;
    this.systemPromptTemplate = this._loadPromptTemplate(config.systemPrompt);
  }

  async processChat(message, chatHistory = [], context = {}) {
    const messages = await this._buildMessages(message, chatHistory, context);
    const response = await this.llm.invoke(messages);

    const text = this._extractTextContent(response);
    const toolCalls = this._extractToolCalls(response);

    return {
      text,
      toolCalls
    };
  }

  _loadPromptTemplate(promptName) {
    const promptPath = join(__dirname, '..', 'prompts', `${promptName}.md`);
    try {
      const template = readFileSync(promptPath, 'utf-8');
      return PromptTemplate.fromTemplate(template, {
        templateFormat: "mustache"
      });
    } catch (error) {
      console.error(`Failed to load prompt: ${promptName}`, error);
      throw new Error(`Prompt file not found: ${promptName}.md`);
    }
  }

  async _buildMessages(message, chatHistory, context) {
    const messages = [];

    const contextString = context && Object.keys(context).length > 0
      ? `The user's current context is:\n${JSON.stringify(context, null, 2)}\n\nUse this context to provide more relevant and personalized responses.`
      : '';

    const systemPrompt = await this.systemPromptTemplate.format({
      assistantName: this.config.assistantName,
      context: contextString
    });

    messages.push(new SystemMessage(systemPrompt));

    chatHistory.forEach((msg) => {
      switch (msg.role) {
        case 'user':
          messages.push(new HumanMessage(msg.content));
          break;
        case 'assistant':
          messages.push(new AIMessage(msg.content));
          break;
        case 'system':
          messages.push(new SystemMessage(msg.content));
          break;
      }
    })

    messages.push(new HumanMessage(message));

    return messages;
  }

  _extractTextContent(response) {
    let text = '';
    if (typeof response.content === 'string') {
      text = response.content;
    } else if (Array.isArray(response.content)) {
      // Claude returns content as array with text and tool_use blocks
      text = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');
    }
    return text;
  }

  _extractToolCalls(response) {
    const toolCalls = [];
    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        toolCalls.push({
          id: toolCall.id || `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          toolName: toolCall.name,
          parameters: toolCall.args || {}
        });
      }
    }
    return toolCalls;
  }
}

export default AIAgentService;
