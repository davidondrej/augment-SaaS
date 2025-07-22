import { useState } from 'react';
import './ChatPane.css';

const ChatPane = ({ messages, setMessages, loading, setLoading, setSchema }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentInput = inputValue;
    setInputValue('');
    setLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: updatedMessages.slice(0, -1) // Send all messages except the current one
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Add assistant response to chat
        const assistantMessage = {
          role: 'assistant',
          content: data.response
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Try to parse the response as JSON schema
        try {
          const parsedSchema = JSON.parse(data.response);
          if (parsedSchema.title && parsedSchema.fields) {
            setSchema(parsedSchema);
          }
        } catch (parseError) {
          // If it's not valid JSON, just show the text response
          console.log('Response is not valid JSON schema, showing as text');
        }
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-pane">
      <div className="chat-header">
        <h2>Form Builder Chat</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content loading">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe the form you want to create..."
          className="chat-input"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !inputValue.trim()} className="chat-submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPane;
