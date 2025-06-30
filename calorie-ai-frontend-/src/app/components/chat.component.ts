import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../services/chat.service';
import { MessageComponent } from './message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  template: `
    <div class="chat-container">
      <!-- Header -->
      <header class="chat-header">
        <div class="header-content">
          <div class="bot-avatar">🥗</div>
          <div class="header-text">
            <h1 class="bot-name">CalorieHive (beta)</h1>
            <p class="bot-status" [class.typing]="isTyping">
              {{ isTyping ? 'Analyzing nutrition...' : 'Your AI Nutritionist' }}
            </p>
          </div>
          <button class="settings-btn" (click)="clearChat()">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 6H16M6 6V4C6 3.44772 6.44772 3 7 3H13C13.5523 3 14 3.44772 14 4V6M8 10V14M12 10V14M5 6L5.7 14.3C5.79 15.3 6.6 16 7.6 16H12.4C13.4 16 14.21 15.3 14.3 14.3L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Messages -->
      <div class="messages-container" #messagesContainer>
        <div class="messages-list">
          <!-- Welcome message -->
          <div class="welcome-message" *ngIf="messages.length === 0">
            <div class="welcome-content">
              <h2>Hey {{ userName }}! 👋</h2>
              <p>I'm here to help you with nutrition analysis, meal planning, and healthy eating advice.</p>
              <div class="quick-actions">
                <button 
                  class="quick-action-btn" 
                  (click)="sendQuickMessage('What did you eat today?')">
                  📝 Log Today's Meals
                </button>
                <button 
                  class="quick-action-btn" 
                  (click)="sendQuickMessage('Suggest healthy breakfast ideas')">
                  🍳 Meal Suggestions
                </button>
                <button 
                  class="quick-action-btn" 
                  (click)="sendQuickMessage('How many calories should I eat per day?')">
                  🎯 Calorie Goals
                </button>
              </div>
            </div>
          </div>

          <!-- Chat messages -->
          <app-message 
            *ngFor="let message of messages; trackBy: trackByMessageId"
            [message]="message">
          </app-message>

          <!-- Typing indicator -->
          <div class="typing-indicator" *ngIf="isTyping">
            <div class="typing-avatar">🤖</div>
            <div class="typing-bubble">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-container">
        <div class="input-wrapper">
          <div class="input-field">
            <input 
              type="text" 
              [(ngModel)]="currentMessage" 
              (keyup.enter)="sendMessage()"
              placeholder="Ask about nutrition, log your meals..."
              class="message-input"
              [disabled]="isTyping"
              #messageInput>
            <button 
              (click)="sendMessage()" 
              [disabled]="!currentMessage.trim() || isTyping"
              class="send-btn">
              <svg *ngIf="!isTyping" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18 2L9 11L4 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 2L11 18L9 11L2 9L18 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div *ngIf="isTyping" class="loading-spinner"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      overflow: hidden;
    }

    .chat-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid #f1f5f9;
      padding: 16px 20px;
      position: relative;
      z-index: 10;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-content {
      display: flex;
      align-items: center;
      max-width: 768px;
      margin: 0 auto;
    }

    .bot-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-right: 12px;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .header-text {
      flex: 1;
    }

    .bot-name {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.2;
    }

    .bot-status {
      font-size: 13px;
      color: #64748b;
      margin: 2px 0 0 0;
      transition: all 0.3s ease;
    }

    .bot-status.typing {
      color: #3b82f6;
      font-weight: 500;
    }

    .settings-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: #f8fafc;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .settings-btn:hover {
      background: #f1f5f9;
      color: #374151;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      scroll-behavior: smooth;
    }

    .messages-list {
      max-width: 768px;
      margin: 0 auto;
      padding: 24px 20px;
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }

    .welcome-message {
      text-align: center;
      padding: 40px 20px;
      margin-bottom: 32px;
    }

    .welcome-content h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 12px;
    }

    .welcome-content p {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 320px;
      margin: 0 auto;
    }

    .quick-action-btn {
      padding: 16px 20px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .quick-action-btn:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      transform: translateY(-1px);
    }

    .typing-indicator {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      margin: 16px 0;
      animation: fadeIn 0.3s ease;
    }

    .typing-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .typing-bubble {
      background: #ffffff;
      border-radius: 20px 20px 20px 6px;
      padding: 16px 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f5f9;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
    }

    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94a3b8;
      animation: typingDot 1.4s infinite ease-in-out;
    }

    .typing-dots span:nth-child(1) { animation-delay: 0ms; }
    .typing-dots span:nth-child(2) { animation-delay: 160ms; }
    .typing-dots span:nth-child(3) { animation-delay: 320ms; }

    @keyframes typingDot {
      0%, 60%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      30% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .input-container {
      padding: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid #f1f5f9;
    }

    .input-wrapper {
      max-width: 768px;
      margin: 0 auto;
    }

    .input-field {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      border: 2px solid #e5e7eb;
      border-radius: 24px;
      padding: 4px 4px 4px 20px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .input-field:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }

    .message-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
      padding: 16px 0;
      background: transparent;
      color: #1a1a1a;
    }

    .message-input::placeholder {
      color: #9ca3af;
    }

    .send-btn {
      width: 44px;
      height: 44px;
      border: none;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .send-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .chat-header {
        padding: 12px 16px;
      }
      
      .messages-list {
        padding: 16px;
      }
      
      .input-container {
        padding: 16px;
      }
      
      .welcome-content h2 {
        font-size: 22px;
      }
      
      .quick-actions {
        max-width: 100%;
      }
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @Input() userName!: string;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isTyping: boolean = false;
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Add a small delay to show welcome message smoothly
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isTyping) return;

    const userMessage: ChatMessage = {
      id: this.chatService.generateId(),
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;
    this.shouldScrollToBottom = true;

    this.chatService.sendMessage(messageToSend, this.userName).subscribe({
      next: (response) => {
        const botMessage: ChatMessage = {
          id: this.chatService.generateId(),
          text: response.response,
          isUser: false,
          timestamp: new Date(),
          responseType: response.responseType,
          nutritionData: this.extractNutritionData(response.response, response.responseType)
        };

        this.messages.push(botMessage);
        this.isTyping = false;
        this.shouldScrollToBottom = true;
        
        // Focus back to input
        setTimeout(() => {
          this.messageInput.nativeElement.focus();
        }, 100);
      },
      error: (error) => {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          id: this.chatService.generateId(),
          text: "Sorry, I'm having trouble connecting right now. Please try again! 😅",
          isUser: false,
          timestamp: new Date(),
          responseType: 'error'
        };
        
        this.messages.push(errorMessage);
        this.isTyping = false;
        this.shouldScrollToBottom = true;
      }
    });
  }

  sendQuickMessage(message: string) {
    this.currentMessage = message;
    this.sendMessage();
  }

  clearChat() {
    this.messages = [];
    this.currentMessage = '';
    this.isTyping = false;
  }

  private scrollToBottom() {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  private extractNutritionData(response: string, responseType: string): any {
    if (responseType === 'food_analysis') {
      // Extract total nutrition info
      const totalMatch = response.match(/\*\*Total:\*\*\s*(\d+)\s*calories.*?(\d+)g?\s*protein.*?(\d+)g?\s*carbs.*?(\d+)g?\s*fat/i);
      
      if (totalMatch) {
        return {
          total: {
            calories: parseInt(totalMatch[1]),
            protein: parseInt(totalMatch[2]),
            carbs: parseInt(totalMatch[3]),
            fat: parseInt(totalMatch[4])
          },
          items: this.chatService.extractMealItems(response)
        };
      }
    }
    
    return null;
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }
}