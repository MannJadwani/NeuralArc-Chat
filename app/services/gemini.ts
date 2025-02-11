import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface GeminiConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export async function generateGeminiResponse(
  prompt: string,
  config: GeminiConfig = {},
  onPartialResponse?: (text: string) => void
) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      ...config
    });

    // Start the generation
    const result = await model.generateContentStream([prompt]);

    let fullResponse = '';

    // Handle streaming response
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      
      // Call the callback with the partial response if provided
      if (onPartialResponse) {
        onPartialResponse(fullResponse);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export async function generateGeminiCodeResponse(
  prompt: string,
  config: GeminiConfig = {},
  onPartialResponse?: (text: string) => void
) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      ...config
    });

    // Add code-specific instructions to the prompt
    const enhancedPrompt = `You are a coding assistant. Please provide clear, well-documented code with explanations.
    If you're providing code, wrap it in appropriate markdown code blocks with the language specified.
    ${prompt}`;

    const result = await model.generateContentStream([enhancedPrompt]);

    let fullResponse = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      
      if (onPartialResponse) {
        onPartialResponse(fullResponse);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export async function generateGeminiChatResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  config: GeminiConfig = {},
  onPartialResponse?: (text: string) => void
) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      ...config
    });

    // Convert the chat history to Gemini's format
    const lastMessage = messages[messages.length - 1].content;

    // For Gemini, we'll use a simplified approach since it doesn't support direct chat history
    const contextPrompt = messages.slice(0, -1).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const fullPrompt = contextPrompt 
      ? `${contextPrompt}\n\nUser: ${lastMessage}\nAssistant:`
      : `User: ${lastMessage}\nAssistant:`;

    // Generate the response
    const result = await model.generateContentStream([fullPrompt]);

    let fullResponse = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      
      if (onPartialResponse) {
        onPartialResponse(fullResponse);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
} 