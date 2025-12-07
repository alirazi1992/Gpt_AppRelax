export type Role = 'system' | 'user' | 'assistant';
export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isToolOutput?: boolean;
  toolName?: string;
}
export interface ToolCall {
  tool: string;
  args: Record<string, any>;
}
export interface ToolResult {
  isToolCall: boolean;
  toolName?: string;
  toolResult?: any;
  finalText?: string;
}
export type Direction = 'rtl' | 'ltr';