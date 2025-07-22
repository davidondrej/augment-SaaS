# Vibe Code Form Builder — AI Instruction Blueprint

<env>
- before running any terminal commands, activate the conda env "augment"
- all dependencies must be installed within the conda env "augment"
</env>

## Project Goal


Build a simple local web application that lets the user create and modify web forms in real time using natural language through a chat interface. The application should take the user’s chat input, send it to an AI, receive a complete form schema in response, and render that schema as a live, interactive form in the UI.


---


## What Already Exists


- A backend folder with Python, Flask, Flask-CORS, python-dotenv, and OpenAI SDK installed.
- A frontend folder initialized with a React project using Create React App or Vite.
- Environment variable for the OpenAI API key is configured and available locally.
- No hosting, no database, and no deployment is required—everything runs on localhost.


---


## What we need to do


- Generate a backend that accepts a sequence of chat messages and sends them to the OpenAI chat API.
- Maintain a system prompt that instructs the AI to return a full JSON schema representing a form.
- On every user message, send the full history of the conversation to the OpenAI API.
- Always return the complete, updated schema—never partial edits.
- Parse the schema on the frontend, validate it, and render it as a form dynamically.
- Handle invalid or malformed JSON with a retry option or error message.
- Keep the interface minimal and responsive, suitable for a demo video.


---


## AI Development Flow


1. **Backend Setup**
  - Create a POST endpoint that receives chat messages.
  - Prepare and include a consistent system prompt.
  - Call the OpenAI API with the full chat history including the system and assistant messages.
  - Return the AI's response to the frontend.


2. **Chat System**
  - Build a chat interface on the left side of the screen.
  - Maintain a history of messages from the user and the assistant.
  - Trigger the backend call when the user sends a new message.


3. **Form Schema Handling**
  - Expect the AI to return a JSON schema with a title and a list of fields.
  - Parse the schema on the frontend and store it as the current form schema.
  - Validate the schema format before rendering.


4. **Dynamic Form Rendering**
  - Build a component that takes the form schema and renders input elements.
  - Each field will have a type (text, number, email, checkbox, etc.), a label, and a required flag.
  - The form should update instantly when a new schema is received.


5. **User Feedback & Error Handling**
  - If parsing fails, show an error bubble in the chat.
  - Include a retry option that re-sends the last message.
  - Provide visual feedback when loading or waiting for a response.


6. **Design and Layout**
  - Use a two-column layout: narrow chat sidebar and wide form panel.
  - Use basic inline styles or minimal CSS to make it clean but not complex.
  - Avoid external styling frameworks unless absolutely necessary.


---


## Prompt Strategy for OpenAI


- The system prompt should describe the exact schema format expected.
- The assistant is expected to always return only a JSON object.
- Avoid additional text, explanation, or commentary.
- Keep temperature low for predictable structure (0.0–0.2).
- Include the most recent schema as context to ensure continuity.


---


## Final Notes


The purpose is to keep the project simple, minimal, and fully local—just enough to demonstrate how AI can be used to vibe-code a working form interface from chat instructions. The AI should focus on generating full-function components and logic that connect seamlessly, without requiring third-party services or advanced deployment infrastructure.

