import React, { useState } from 'react';
import './App.css';
import ChatPane from './components/ChatPane';
import FormPane from './components/FormPane';

function App() {
  // Basic state management
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you create forms. What kind of form would you like to build?' }
  ]);
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <div className="app-container">
        <ChatPane
          messages={messages}
          setMessages={setMessages}
          loading={loading}
          setLoading={setLoading}
          setSchema={setSchema}
        />
        <FormPane
          schema={schema}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
