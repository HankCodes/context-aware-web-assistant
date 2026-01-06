/**
 * Unified Tool Configuration
 *
 * This is the place to register all tools.
 * Each tool defines:
 * - executor: Function to execute when AI calls the tool (can be API call, local logic, anything)
 * - component: React component to render the result
 * - renderLocation: Where to render ('drawer' or 'component-area')
 *
 * To add a new tool:
 * 1. Import your component
 * 2. Add an entry to toolsConfig with executor, component, and renderLocation
 */

import TimeDisplay from '../components/AIToolComponents/TimeDisplay';
import SampleDataList from '../components/AIToolComponents/SampleDataList';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Tools Configuration
 *
 * Each key is a tool name that matches the tool name from the backend.
 * Each value is an object with:
 * - executor: async function(parameters) => returns data
 * - component: React component to render the data
 * - renderLocation: 'drawer' | 'component-area'
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
  //   renderLocation: 'drawer' // or 'component-area'
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
