/**
 * Tool Executor and Renderer
 * Handles both execution and rendering of tools using the unified tools configuration
 */

import { toolsConfig } from './toolsConfig';

/**
 * Executes a tool call
 * @param {string} toolName - The name of the tool to execute
 * @param {Object} parameters - The parameters for the tool
 * @returns {Promise<Object>} The result from the tool execution
 */
export async function executeToolCall(toolName, parameters) {
  const tool = toolsConfig[toolName];

  if (!tool || !tool.executor) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  return await tool.executor(parameters);
}

/**
 * Gets the renderer component for a given tool name
 * @param {string} toolName - The name of the tool
 * @returns {React.Component|null} The renderer component or null if not found
 */
export function getToolRenderer(toolName) {
  const tool = toolsConfig[toolName];
  return tool?.component || null;
}

/**
 * Gets the render location for a given tool name
 * @param {string} toolName - The name of the tool
 * @returns {string} "component-area" or "drawer"
 */
export function getToolRenderLocation(toolName) {
  const tool = toolsConfig[toolName];
  return tool?.renderLocation || 'drawer';
}
