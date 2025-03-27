import React, { useState, useRef, useEffect } from 'react';

// 1. Define the shape of a single chat message
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const BalleyAI: React.FC = () => {
  // 2. State to store all messages
  const [messages, setMessages] = useState<Message[]>([]);

  // 3. State for the current user input
  const [inputText, setInputText] = useState('');

  // 4. Loading/error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 5. Ref to keep the scroll view pinned to bottom
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 6. Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 7. Function to handle user sending a message
  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Clear any existing error
    setError(null);

    // Add the user's message to the conversation
    const newUserMessage: Message = {
      role: 'user',
      content: inputText.trim(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');

    // Begin loading
    setIsLoading(true);

    try {
      // 8. Make the API call to our FastAPI chatbot endpoint
      //    (Make sure your backend is running at http://localhost:8000 or similar)
      const response = await fetch('http://localhost:8000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_message: newUserMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chatbot API responded with status ${response.status}`);
      }

      // 9. Parse the data from the backend
      const data = await response.json();

      // The backend can respond with:
      // {
      //   "assistant_response": "...some text answer..."
      // }
      // or a function call:
      // {
      //   "message": "Function call received: create_employee",
      //   "args": { first_name: "John", last_name: "Doe" }
      // }
      //
      // We'll handle both cases below:

      if (data.assistant_response) {
        // This is a normal text response from the assistant
        const newAssistantMessage: Message = {
          role: 'assistant',
          content: data.assistant_response.trim(),
        };
        setMessages(prev => [...prev, newAssistantMessage]);
      } else if (data.message) {
        // Possibly a function call or something else
        const functionCallMessage: Message = {
          role: 'assistant',
          content: `Called function: ${data.message} \nArguments: ${JSON.stringify(data.args, null, 2)}`,
        };
        setMessages(prev => [...prev, functionCallMessage]);
      } else {
        // Fallback if no recognized structure
        const fallbackMessage: Message = {
          role: 'assistant',
          content: 'I’m not sure how to handle that response.',
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (err: any) {
      console.error('Error calling chatbot API:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // 12. Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      {/* Title or Header */}
      <div style={styles.header}>
        <h2>Balley A.I. - Payroll Chat Assistant</h2>
      </div>

      {/* Messages List */}
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === 'user'
                ? { ...styles.message, ...styles.userMessage }
                : { ...styles.message, ...styles.assistantMessage }
            }
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error and Loading status */}
      {error && <div style={styles.error}>{error}</div>}
      {isLoading && <div style={styles.loading}>Thinking...</div>}

      {/* Input Box + Send Button */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={handleSend} disabled={isLoading} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

// Basic inline styles (you might prefer styled-components / CSS modules / Tailwind)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #ccc',
    backgroundColor: '#f4f4f4',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    marginBottom: '0.75rem',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    maxWidth: '70%',
    lineHeight: 1.4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    color: 'white',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '0.5rem',
  },
  input: {
    flex: 1,
    fontSize: '1rem',
    padding: '0.5rem',
    marginRight: '0.5rem',
  },
  sendButton: {
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: '0.5rem 0',
  },
  loading: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: '0.5rem',
  },
};

export default BalleyAI;