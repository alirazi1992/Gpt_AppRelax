import { ToolResult } from '../types/chat';

// 1. Calculator Tool
export function calculatorTool(expression: string): string {
  try {
    // Basic safety check: only allow numbers and math operators
    if (!/^[\d\s+\-*/().]+$/.test(expression)) {
      return 'خطا: ورودی نامعتبر (Invalid input)';
    }
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expression}`)();
    return String(result);
  } catch (e) {
    return 'خطا در محاسبه (Calculation error)';
  }
}

// 2. Persian Date Tool
export function persianDateTool(): {
  gregorian: string;
  jalali: string;
} {
  const now = new Date();
  const gregorian = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);
  const jalali = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);
  return {
    gregorian,
    jalali
  };
}

// 3. Translate Tool (Mock)
export function translateTool(text: string, direction: 'fa-en' | 'en-fa'): string {
  const prefix = direction === 'fa-en' ? '[FA->EN Translation]: ' : '[EN->FA Translation]: ';
  // In a real app, this would call a translation API
  return `${prefix}${text}`;
}

// 4. Docs QA Tool (Mock)
export function docsQaTool(query: string): string {
  // Mock knowledge base
  const knowledge = ['Persian Lambda Chat is a bilingual AI assistant.', 'It supports tools like calculator, date conversion, and translation.', 'The app is built with React, TypeScript, and Tailwind CSS.', 'RTL support is automatic based on the text content.'];
  const relevant = knowledge.find(k => k.toLowerCase().includes(query.toLowerCase()));
  if (relevant) {
    return `یافته شده در اسناد: "${relevant}"`;
  }
  return 'هیچ سندی برای جست‌وجو پیدا نشد. (No documents found matching your query.)';
}

// Tool Manager
export function handleToolCall(rawOutput: string): ToolResult {
  try {
    // Attempt to parse JSON
    // Sometimes LLMs wrap JSON in markdown blocks, strip them if needed
    const cleanOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!cleanOutput.startsWith('{') || !cleanOutput.endsWith('}')) {
      return {
        isToolCall: false,
        finalText: rawOutput
      };
    }
    const parsed = JSON.parse(cleanOutput);
    if (parsed.tool && parsed.args) {
      let result: any = null;
      switch (parsed.tool) {
        case 'calculator':
          result = calculatorTool(parsed.args.expression);
          break;
        case 'persian_date':
          result = persianDateTool();
          break;
        case 'translate':
          result = translateTool(parsed.args.text, parsed.args.direction);
          break;
        case 'docs_qa':
          result = docsQaTool(parsed.args.query);
          break;
        default:
          return {
            isToolCall: false,
            finalText: rawOutput
          };
      }
      return {
        isToolCall: true,
        toolName: parsed.tool,
        toolResult: result
      };
    }
    return {
      isToolCall: false,
      finalText: rawOutput
    };
  } catch (e) {
    return {
      isToolCall: false,
      finalText: rawOutput
    };
  }
}