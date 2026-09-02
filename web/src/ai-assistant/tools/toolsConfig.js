/**
 * Unified Tool Configuration
 *
 * This is the place to register all tools.
 * Each tool defines:
 * - executor: Function to execute when AI calls the tool (can be API call, local logic, anything)
 * - component: React component to render the result (omit for an 'answer' tool, see below)
 * - renderLocation: Where the result goes - one of:
 *     - 'drawer': a standalone card in the tool drawer (see ToolDrawer)
 *     - 'component-area': a standalone card wherever you've placed <ComponentArea /> in your app
 *     - 'inline': rendered directly in the chat message flow, at the point in the conversation
 *       where the tool was called - use this for a result that reads like part of the
 *       conversation itself (a small card, a chart, a confirmation), not a persistent widget.
 *       Unlike 'drawer'/'component-area', inline results are never deduplicated by tool name -
 *       calling the same tool twice in a conversation shows two separate results, in order,
 *       the way two chat messages would.
 *     - 'answer': no UI at all - the result is sent straight back to the backend so the model
 *       can turn it into a natural-language reply on a second turn, instead of guessing. Use
 *       this for a factual/counting question you want answered from real data. `component` can
 *       be omitted for this type; see getSampleDataCount below and AIAssistant.js for how the
 *       round-trip works.
 *
 * To add a new tool:
 * 1. Import your component (skip this for an 'answer' tool)
 * 2. Add an entry to toolsConfig with executor, component, and renderLocation
 */

import TimeDisplay from '../components/AIToolComponents/TimeDisplay';
import SampleDataList from '../components/AIToolComponents/SampleDataList';
import { ProfileFormToolCard } from '../components/AIToolComponents/ProfileForm';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Tools Configuration
 *
 * Each key is a tool name that matches the tool name from the backend.
 * Each value is an object with:
 * - executor: async function(parameters) => returns data
 * - component: React component to render the data (omit for renderLocation: 'answer')
 * - renderLocation: 'drawer' | 'component-area' | 'inline' | 'answer'
 */
export const toolsConfig = {
  /**
   * Get Current Time Tool
   * Example: API call to backend
   */
  getCurrentTime: {
    executor: async (parameters) => {
      const { timezone } = parameters;
      const queryParams = timezone ? `?timezone=${encodeURIComponent(timezone)}` : '';

      const response = await fetch(`${API_BASE_URL}/api/time${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch current time');
      }

      return await response.json();
    },
    component: TimeDisplay,
    renderLocation: 'drawer'
  },

  /**
   * Get Sample Data Tool
   * Example: API call with filtering
   */
  getSampleData: {
    executor: async (parameters) => {
      const { category } = parameters;
      const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';

      const response = await fetch(`${API_BASE_URL}/api/sample-data${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch sample data');
      }

      return await response.json();
    },
    component: SampleDataList,
    renderLocation: 'component-area'
  },

  /**
   * Update Profile Context Tool
   * Pure frontend tool - no backend call needed. Renders a form the user
   * fills in and saves; saving merges the values into shared context.
   */
  updateProfileContext: {
    executor: async () => ({}),
    component: ProfileFormToolCard,
    renderLocation: 'drawer'
  },

  /**
   * Get Sample Data Count Tool (renderLocation: 'answer')
   * Answers a factual/counting question ("how many sample items are there?") from real data
   * instead of the model guessing a number. No `component` - nothing renders here. The
   * frontend fetches the real count and hands it back to the backend, which invokes the model
   * a second time to compose the actual reply; see AIAssistant.js for how that round-trip
   * works, and getSampleDataCount's description in api/services/toolsService.js for the
   * matching backend schema.
   */
  getSampleDataCount: {
    executor: async (parameters) => {
      const { category } = parameters;
      const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';

      const response = await fetch(`${API_BASE_URL}/api/sample-data${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch sample data');
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : data.items || [];
      return { category: category || 'all', count: items.length };
    },
    renderLocation: 'answer'
  },

  // Add more tools here following the same pattern:
  //
  // myCustomTool: {
  //   executor: async (parameters) => {
  //     // Can be:
  //     // - API call: await fetch(...)
  //     // - Local calculation: return { result: parameters.x + parameters.y }
  //     // - Browser API: return { location: navigator.geolocation }
  //     // - State update: update some state and return confirmation
  //     // - Anything you want!
  //     return { data: 'whatever you need' };
  //   },
  //   component: MyCustomComponent,
  //   renderLocation: 'drawer' // or 'component-area', 'inline', 'answer' (omit component for 'answer')
  // },
};


/**
 * Registers a new tool dynamically (for extending from host app)
 * @param {string} toolName - The name of the tool
 * @param {Object} config - Tool configuration object with executor, component, renderLocation
 */
export function registerTool(toolName, config) {
  toolsConfig[toolName] = config;
}
