import { ChatMessage, ToolResult } from '../types/chat';
import { handleToolCall } from './tools';

// Mock LLM response generator since we don't have a real backend running
// In a real app, this would fetch from process.env.LOCAL_LLM_URL
async function mockLlmResponse(messages: ChatMessage[]): Promise<string> {
  const lastMessage = messages[messages.length - 1];
  const content = lastMessage.content.toLowerCase();
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  // Simple keyword matching to simulate "intelligence" and trigger tools
  if (content.match(/(\d+)\s*[\+\-\*\/]\s*(\d+)/)) {
    return JSON.stringify({
      tool: 'calculator',
      args: {
        expression: content.match(/[\d\s\+\-\*\/]+/)?.[0] || '2+2'
      }
    });
  }
  if (content.includes('date') || content.includes('تاریخ') || content.includes('time') || content.includes('ساعت')) {
    return JSON.stringify({
      tool: 'persian_date',
      args: {}
    });
  }
  if (content.includes('translate') || content.includes('ترجمه')) {
    return JSON.stringify({
      tool: 'translate',
      args: {
        text: content.replace(/translate|ترجمه/gi, '').trim(),
        direction: 'en-fa'
      }
    });
  }
  if (content.includes('docs') || content.includes('سند') || content.includes('search') || content.includes('جستجو')) {
    return JSON.stringify({
      tool: 'docs_qa',
      args: {
        query: content.replace(/docs|search|جستجو|سند/gi, '').trim()
      }
    });
  }

  // Default conversational responses
  if (detectDirection(content) === 'rtl') {
    return 'من یک دستیار هوشمند هستم که می‌توانم به شما در انجام محاسبات، ترجمه متون و جستجو در اسناد کمک کنم. چطور می‌توانم امروز به شما کمک کنم؟';
  }
  return 'I am a smart assistant capable of helping you with calculations, translations, and document search. How can I help you today?';
}
function detectDirection(text: string): 'rtl' | 'ltr' {
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text) ? 'rtl' : 'ltr';
}
export async function sendMessageToLLM(messages: ChatMessage[]): Promise<ChatMessage[]> {
  try {
    // 1. Get initial response
    const rawResponse = await mockLlmResponse(messages);

    // 2. Check for tool calls
    const toolResult = handleToolCall(rawResponse);
    if (!toolResult.isToolCall) {
      return [{
        id: Date.now().toString(),
        role: 'assistant',
        content: toolResult.finalText || rawResponse,
        timestamp: Date.now()
      }];
    }

    // 3. Handle tool execution flow
    // In a real backend, we would feed the tool result back to the LLM.
    // Here we'll just construct a final response based on the tool result.

    const toolOutputMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Tool Used: ${toolResult.toolName}`,
      timestamp: Date.now(),
      isToolOutput: true,
      toolName: toolResult.toolName
    };
    let finalContent = '';
    if (toolResult.toolName === 'persian_date') {
      const res = toolResult.toolResult;
      finalContent = `تاریخ امروز:\nمیلادی: ${res.gregorian}\nشمسی: ${res.jalali}`;
    } else if (toolResult.toolName === 'calculator') {
      finalContent = `نتیجه محاسبه: ${toolResult.toolResult}`;
    } else {
      finalContent = `نتیجه: ${JSON.stringify(toolResult.toolResult)}`;
    }
    const finalMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: finalContent,
      timestamp: Date.now()
    };
    return [toolOutputMessage, finalMessage];
  } catch (error) {
    console.error('LLM Error:', error);
    return [{
      id: Date.now().toString(),
      role: 'assistant',
      content: 'متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.\nSorry, an error occurred. Please try again.',
      timestamp: Date.now()
    }];
  }
}