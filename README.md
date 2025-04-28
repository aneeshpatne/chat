# AI Chat Platform

A sophisticated conversational AI platform built with Next.js that supports multiple AI models from providers including OpenAI, Google, and Anthropic.

![Chat Interface](https://placehold.co/800x400?text=Chat)

## Features

- **Multi-model Support**: Choose from a variety of AI models including:
  - OpenAI's GPT-4.1 family (4.1, 4.1 Mini, 4.1 Nano)
  - OpenAI's GPT-4o models
  - OpenAI's O-Series models (o3, o3 Mini, o4 Mini, o3 Mini High, o4 Mini High)
  - Google's Gemini models (2.5 Pro, 2.0 Flash)
  - Anthropic's Claude models (3.7, 3.5)
  - X.Ai's Grok
- **Modern UI**: Clean, responsive interface with dark mode support
- **Session Management**: Persistent chat sessions with unique URLs
- **Auto-generated Titles**: Automatically generates relevant titles for chat sessions
- **Token Usage Tracking**: View token usage statistics for each conversation
- **Reasoning Display**: View the AI's reasoning process for certain models
- **Markdown Support**: Rich text formatting in AI responses
- **Code Highlighting**: Syntax highlighting for code blocks
- **Copy to Clipboard**: Easily copy messages and code snippets

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- API keys for the AI providers you wish to use:
  - OpenAI API key
  - OpenRouter API key (for Anthropic and some Google models)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-chat-platform.git
cd ai-chat-platform
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your API keys:

```
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
GOOGLE_API_KEY=your_google_api_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- Begin typing in the input box at the bottom of the screen to start a conversation
- Use the model selector to choose different AI models
- Chat sessions are automatically saved with unique URLs you can share or revisit later
- View token usage statistics at the bottom of each AI response
- Expand/collapse the reasoning section to see the AI's thought process
- Use the copy button to copy messages to your clipboard

## Project Structure

```
├── package.json                # Root package.json
├── tailwind.config.js          # Tailwind configuration
└── chat/                       # Main application directory
    ├── app/                    # Next.js app directory
    │   ├── (chat)/             # Chat routes
    │   ├── api/                # API routes
    │   │   └── (chat)/         # Chat API endpoints
    │   └── globals.css         # Global styles
    ├── components/             # React components
    │   ├── chat.jsx            # Main chat component
    │   ├── chatnew.jsx         # New chat interface
    │   ├── CodeBlock.jsx       # Code block rendering
    │   ├── mdcomponents.jsx    # Markdown components
    │   ├── models.tsx          # AI model configurations
    │   ├── ReceivedMessage.jsx # Message display component
    │   └── ui/                 # UI components
    └── lib/                    # Utility functions
```

## Environment Variables

| Variable             | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `OPENAI_API_KEY`     | API key for OpenAI services                                 |
| `OPENROUTER_API_KEY` | API key for OpenRouter (provides access to multiple models) |
| `GOOGLE_API_KEY`     | API key for Google AI services                              |

## Deployment

This application can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fai-chat-platform)

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [AI SDK](https://github.com/vercel-labs/ai) - SDK for AI model integration
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [Prism.js](https://prismjs.com/) - Syntax highlighting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
