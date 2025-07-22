import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI client (will be set up in the route)
client = None
api_key = os.getenv('OPENAI_API_KEY')

# System prompt that forces JSON-only form schemas
SYSTEM_PROMPT = """You are a form builder assistant. You must respond ONLY with valid JSON representing a form schema. Never include explanations, comments, or any text outside the JSON.

The JSON schema must follow this exact format:
{
  "title": "Form Title",
  "fields": [
    {
      "id": "unique_field_id",
      "type": "text|email|number|checkbox|select|textarea",
      "label": "Field Label",
      "required": true|false,
      "placeholder": "Optional placeholder text",
      "options": ["option1", "option2"] // Only for select type
    }
  ]
}

Always return a complete form schema, never partial updates. Ensure all JSON is valid and properly formatted."""

@app.route('/chat', methods=['POST'])
def chat():
    print("Received chat request")  # Debug logging
    try:
        # Get the request data
        data = request.get_json()
        print(f"Request data: {data}")  # Debug logging

        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400

        user_message = data['message']
        chat_history = data.get('history', [])

        # Check if we have a valid API key
        if not api_key or api_key == 'test_key_for_now':
            # Return a mock response for testing
            mock_response = {
                "title": "Contact Form",
                "fields": [
                    {
                        "id": "name",
                        "type": "text",
                        "label": "Full Name",
                        "required": True,
                        "placeholder": "Enter your full name"
                    },
                    {
                        "id": "email",
                        "type": "email",
                        "label": "Email Address",
                        "required": True,
                        "placeholder": "Enter your email"
                    },
                    {
                        "id": "message",
                        "type": "textarea",
                        "label": "Message",
                        "required": True,
                        "placeholder": "Enter your message"
                    }
                ]
            }

            return jsonify({
                'response': str(mock_response).replace("'", '"'),
                'success': True
            })

        # Initialize OpenAI client if we have a real API key
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
        except Exception as openai_error:
            return jsonify({
                'error': f'OpenAI client initialization failed: {str(openai_error)}',
                'success': False
            }), 500

        # Build the messages array for OpenAI
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add chat history
        for msg in chat_history:
            messages.append(msg)

        # Add the current user message
        messages.append({"role": "user", "content": user_message})

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.1,
            max_tokens=1500
        )

        # Extract the AI response
        ai_response = response.choices[0].message.content.strip()

        return jsonify({
            'response': ai_response,
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Flask app is running'})

if __name__ == '__main__':
    # Check if OpenAI API key is available
    if not api_key:
        print("Warning: OPENAI_API_KEY not found in environment variables")
        print("Using mock responses for testing")
    elif api_key == 'test_key_for_now':
        print("Using test API key - mock responses will be returned")
    else:
        print("Using real OpenAI API key")

    app.run(debug=True, host='0.0.0.0', port=5001)
