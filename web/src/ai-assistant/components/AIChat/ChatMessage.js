import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getToolRenderer } from '../../tools/toolHandler';
import './ChatMessage.css';

/**
 * Renders one entry from the chat message list.
 *
 * For role 'user'/'assistant', renders `content` as markdown, as usual.
 *
 * For role 'tool' - only ever passed here for a tool whose `renderLocation` is 'inline' (see
 * toolsConfig.js and ChatDrawer.js, which filters to just those) - renders that tool's own
 * component with `data`, in place, at this point in the conversation. This is what makes an
 * 'inline' tool feel like part of the conversation instead of a separate widget.
 */
function ChatMessage({ role, content, toolName, data }) {
  if (role === 'tool') {
    const ToolComponent = getToolRenderer(toolName);

    return (
      <div className="chat-message tool-message">
        <div className="message-header">
          <span className="message-role">{toolName}</span>
        </div>
        <div className="tool-content">
          {ToolComponent ? (
            <ToolComponent data={data} />
          ) : (
            <div className="tool-error">Unknown tool: {toolName}</div>
          )}
        </div>
      </div>
    );
  }

  const isUser = role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-header">
        <span className="message-role">
          {isUser ? 'You' : 'Assistant'}
        </span>
      </div>
      <div className="message-content markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            code: ({node, inline, ...props}) =>
              inline
                ? <code className="inline-code" {...props} />
                : <code className="code-block" {...props} />,
            pre: ({node, ...props}) => <pre className="pre-block" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default ChatMessage;
