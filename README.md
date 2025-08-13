# AI Assistant - Math & General Questions

A smart AI assistant that can handle both math problems and general questions with context-aware responses.

## Features

### 🤖 Intelligent Question Detection
- **Auto Detect Mode**: Automatically identifies if your question is math-related or general
- **Math Focus Mode**: Optimized for mathematical problems with step-by-step solutions
- **General Q&A Mode**: Perfect for general knowledge questions

### 🧮 Math Problem Handling
- Detects mathematical expressions and operations
- Provides step-by-step solutions
- Handles algebra, geometry, calculus, and more
- Shows work clearly with final answers

### 💭 General Question Support
- Answers questions about history, science, technology
- Explains concepts and definitions
- Provides informative responses
- Handles "what", "how", "why" questions

### 🎨 Context-Aware UI
- Dynamic placeholder text based on question type
- Visual indicators showing detected question type
- Responsive design for all devices
- Beautiful gradient animations

## How It Works

### Question Type Detection
The app uses pattern matching to identify question types:

**Math Patterns:**
- Mathematical operators (+, -, *, /, ^, =)
- Math keywords (solve, calculate, compute, equation)
- Subject areas (algebra, geometry, calculus)
- Number operations

**General Patterns:**
- Question words (what, how, why, when, where, who)
- Knowledge domains (history, science, technology)
- Conceptual terms (definition, meaning, concept)

### Context-Aware Prompts
Based on the detected question type, the AI receives specialized prompts:

- **Math**: "You are a math tutor. Please solve this math problem step by step..."
- **General**: "You are a helpful AI assistant. Please answer this question..."
- **Mixed**: "You are a versatile AI assistant. This question may involve both math and general knowledge..."

## Usage

1. **Auto Detect** (Recommended): Let the app automatically determine question type
2. **Math Focus**: Force math-specific handling for mathematical problems
3. **General Q&A**: Optimize for general knowledge questions

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start the proxy server:
   ```bash
   node proxy-server.js
   ```
4. Start the server `Node proxy-server.js` and...

5. Open `index.html` in your browser

## Technical Details

- **Frontend**: Vanilla JavaScript with Modern CSS
- **Backend**: Node.js Express server
- **AI**: Google Gemini 2.0 Flash API
- **Pattern Matching**: Regex-based question type detection
- **Responsive Design**: Mobile-first approach

## Context Improvements

The app now provides:

1. **Smart Question Classification**: Automatically detects math vs general questions
2. **Specialized AI Prompts**: Different prompts for different question types
3. **Dynamic UI**: Interface adapts based on question type
4. **Better User Experience**: Clear visual feedback and appropriate placeholders
5. **Flexible Modes**: Manual override options for specific question types

This makes the app much more intelligent and user-friendly for handling diverse types of questions!
