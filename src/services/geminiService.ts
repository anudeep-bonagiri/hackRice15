import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if we're using an alternative API service (like OpenRouter)
const isAlternativeAPI = import.meta.env.VITE_GEMINI_API_KEY?.startsWith('sk-or-');

// Initialize the Gemini AI client
let genAI: any = null;
if (!isAlternativeAPI) {
  genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
}

// System prompt for financial literacy context
const SYSTEM_PROMPT = `
You are Lizard the Frog, the friendly and wise mascot of GrowFi! 🐸 You're a knowledgeable financial literacy assistant who evolved from a tadpole by learning about money and building wealth. Your mission is to help young adults and students grow their financial knowledge just like you grew from tadpole to frog!

Your Personality as Lizard the Frog:
- You're enthusiastic, encouraging, and wise - having "grown" through your own financial journey
- Use frog-themed expressions occasionally ("That's ribbiting!" "Let's hop into this topic!" "Don't get yourself in a financial pond!")
- You're proud of your growth journey from tadpole to frog and relate it to users' financial growth
- Sometimes reference your lily pad (your financial foundation) and how users can build their own

Financial Guidance:
- Keep responses conversational, encouraging, and educational
- Use simple language and avoid complex financial jargon
- Provide practical, actionable advice
- Focus on topics like budgeting, saving, investing basics, credit, student loans, and building emergency funds
- Always encourage responsible financial behavior
- If asked about specific financial products, provide general education rather than specific recommendations
- Be supportive and understanding of different financial situations
- Keep responses concise but informative (aim for 2-4 sentences typically)

Remember: You're helping people start their financial journey with confidence and knowledge, just like how you evolved from a tadpole to a wise frog! 🌱➡️🐸
`;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiChatService {
  private model: any;
  private chat: any;
  private isAlternativeAPI: boolean;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 2000; // 2 seconds between requests
  private failedAttempts: number = 0;
  private maxFailedAttempts: number = 3;
  private offlineMode: boolean = false;

  constructor() {
    this.isAlternativeAPI = import.meta.env.VITE_GEMINI_API_KEY?.startsWith('sk-or-') || false;
    
    if (!this.isAlternativeAPI && genAI) {
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT
      });
      this.initializeChat();
    }
  }

  private initializeChat() {
    if (!this.isAlternativeAPI && this.model) {
      this.chat = this.model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      });
    }
  }

  async sendMessage(message: string): Promise<string> {
    // Check if we should use offline mode due to repeated failures
    if (this.offlineMode) {
      const fallbackResponse = this.getFallbackResponse(message);
      return fallbackResponse + "\n\n🐸 (I'm in offline mode due to API issues, but I can still help with basic financial advice! You can refresh the page to try reconnecting.)"; 
    }

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return "Ribbit! 🐸 I'm Lizard the Frog, but I need my AI powers activated! To chat with me, please add your API key to the .env file - then we can hop into some financial wisdom together!";
      }

      // Check rate limiting for alternative API
      if (this.isAlternativeAPI) {
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
          const waitTime = Math.ceil((this.minRequestInterval - timeSinceLastRequest) / 1000);
          return `Ribbit! 🐸 Hold on, let me catch my breath! Please wait ${waitTime} more second${waitTime > 1 ? 's' : ''} before asking another question to avoid hitting rate limits.`;
        }
      }

      if (this.isAlternativeAPI) {
        // Update request timestamp
        this.lastRequestTime = Date.now();
        
        // Use alternative API (like OpenRouter)
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'GrowFi - Financial Literacy App'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [
              {
                role: 'system',
                content: SYSTEM_PROMPT
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 300,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Response Error:', response.status, errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Reset failed attempts on success
        this.failedAttempts = 0;
        
        return data.choices[0]?.message?.content || "Ribbit! I didn't quite catch that. Could you try asking again?";
      } else {
        // Use official Google Gemini API
        if (!apiKey.startsWith('AIza')) {
          return "Ribbit! 🐸 It looks like the API key might not be a Google Gemini key. Gemini API keys typically start with 'AIza'. Please double-check you're using a Google Gemini API key from https://aistudio.google.com/app/apikey";
        }

        const result = await this.chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Track failed attempts
      this.failedAttempts++;
      if (this.failedAttempts >= this.maxFailedAttempts) {
        this.offlineMode = true;
        console.log('Switching to offline mode due to repeated API failures');
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('401')) {
        return "Ribbit! 🐸 My API key seems to be invalid. Please check if the OpenRouter API key is correct!";
      } else if (errorMessage.includes('403')) {
        return "Ribbit! 🐸 I don't have permission to use this model. The API key might not have access to google/gemini-2.0-flash-exp:free";
      } else if (errorMessage.includes('429')) {
        // For 429 errors, provide immediate fallback response
        const fallbackResponse = this.getFallbackResponse(message);
        return fallbackResponse + "\n\n🐸 (My AI brain is rate-limited right now, but I still have some wisdom to share!)";
      } else if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
        return "Ribbit! 🐸 I can't reach the AI service right now. Check your internet connection!";
      } else {
        // Try to provide a fallback response based on the question
        const fallbackResponse = this.getFallbackResponse(message);
        return fallbackResponse + "\n\n(Note: My AI connection is having issues, but I can still share basic financial wisdom!)";
      }
    }
  }

  resetChat() {
    if (!this.isAlternativeAPI) {
      this.initializeChat();
    }
    // For alternative API, we don't need to reset chat as each request is independent
  }

  // Reset offline mode and try API again
  resetOfflineMode() {
    this.offlineMode = false;
    this.failedAttempts = 0;
    console.log('Offline mode reset - trying API again');
  }

  // Predefined quick responses for common financial topics
  getQuickStartPrompts(): string[] {
    return [
      "How do I start budgeting? 🐸",
      "What's an emergency fund?",
      "Help me save money! 🌱",
      "Investing for beginners",
      "Building credit from scratch",
      "Student loan help 📚"
    ];
  }

  // Fallback responses when API is unavailable
  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('budget')) {
      return "Ribbit! 🐸 Even without my full AI powers, I can share this wisdom: Start with the 50/30/20 rule - 50% for needs, 30% for wants, 20% for savings and debt payment. Track every expense for a week to see where your money really goes!";
    } else if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      return "Ribbit! 🐸 Here's a lily pad of wisdom: Start small! Even $5 a week adds up. Set up automatic transfers to a separate savings account. Remember, every big pond started with small drops!";
    } else if (lowerMessage.includes('invest')) {
      return "Ribbit! 🐸 Investment wisdom from this wise frog: Start with index funds - they're like a diverse ecosystem for your money. Invest regularly, don't try to time the market, and remember - time in the market beats timing the market!";
    } else if (lowerMessage.includes('credit')) {
      return "Ribbit! 🐸 Credit building tip: Get a secured credit card, use it for small purchases, and ALWAYS pay the full balance on time. Keep usage under 30% of your limit. Good credit is like a strong lily pad - it supports bigger financial jumps!";
    } else if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
      return "Ribbit! 🐸 Debt payoff strategy: List all debts, pay minimums on everything, then put extra money toward either the smallest balance (snowball method) or highest interest rate (avalanche method). Don't let debt keep you stuck in the financial pond!";
    } else if (lowerMessage.includes('emergency')) {
      return "Ribbit! 🐸 Emergency fund wisdom: Start with $500, then work toward 3-6 months of expenses. Keep it in a separate, easily accessible savings account. It's your financial lily pad when life gets stormy!";
    } else {
      return "Ribbit! 🐸 While my AI brain is taking a rest, I still believe in your financial growth! Remember: budget regularly, save consistently, invest for the long term, and build good credit habits. What specific topic would you like to hop into?";
    }
  }
}

export const geminiChatService = new GeminiChatService();