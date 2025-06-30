import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../services/chat.service';
import { NutritionChartComponent } from './nutrition-chart.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, NutritionChartComponent],
  template: `
    <div
      class="message"
      [class.user-message]="message.isUser"
      [class.bot-message]="!message.isUser"
    >
      <div class="message-avatar" *ngIf="!message.isUser">
        <span class="avatar-icon">🤖</span>
      </div>

      <div class="message-content">
        <div
          class="message-bubble"
          [class.user-bubble]="message.isUser"
          [class.bot-bubble]="!message.isUser"
        >
          <!-- Regular message text -->
          <div
            class="message-text"
            [innerHTML]="formatMessage(message.text)"
          ></div>

          <!-- Nutrition data visualization -->
          <div
            class="nutrition-section"
            *ngIf="message.nutritionData && !message.isUser"
          >
            <!-- Nutrition chart -->
            <app-nutrition-chart
              *ngIf="message.nutritionData.total"
              [nutritionData]="message.nutritionData.total"
              [chartType]="getChartType(message.responseType)"
            >
            </app-nutrition-chart>

            <!-- Meal items breakdown -->
            <div
              class="meal-items"
              *ngIf="
                message.nutritionData.items &&
                message.nutritionData.items.length > 0
              "
            >
              <h4 class="items-title">Meal Breakdown</h4>
              <div class="items-list">
                <div
                  class="meal-item"
                  *ngFor="let item of message.nutritionData.items"
                >
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-stats">
                    <span class="stat">{{ item.calories }}cal</span>
                    <span class="stat">{{ item.protein }}g protein</span>
                    <span class="stat">{{ item.carbs }}g carbs</span>
                    <span class="stat">{{ item.fat }}g fat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="message-timestamp">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>

      <div class="message-avatar" *ngIf="message.isUser">
        <span class="avatar-icon user-avatar">😊</span>
      </div>
    </div>
  `,
  styles: [
    `
      .message {
        display: flex;
        align-items: flex-end;
        gap: 12px;
        margin-bottom: 20px;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .user-message {
        flex-direction: row-reverse;
      }

      .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 14px;
      }

      .user-avatar {
        color: white;
        size: 16px;
      }

      .message-content {
        flex: 1;
        max-width: calc(100% - 60px);
      }

      .message-bubble {
        border-radius: 20px;
        padding: 16px 20px;
        position: relative;
        word-wrap: break-word;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #f1f5f9;
      }

      .bot-bubble {
        background: #ffffff;
        border-radius: 20px 20px 20px 6px;
      }

      .user-bubble {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border-radius: 20px 6px 20px 20px;
        border: 1px solid #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .message-text {
        font-size: 15px;
        line-height: 1.5;
        color: inherit;
      }

      .user-bubble .message-text {
        color: white;
      }

      .message-text :global(strong) {
        font-weight: 600;
      }

      .message-text :global(em) {
        font-style: italic;
      }

      .nutrition-section {
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #f1f5f9;
      }

      .meal-items {
        margin-top: 16px;
      }

      .items-title {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 12px;
      }

      .items-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .meal-item {
        background: #f8fafc;
        border-radius: 12px;
        padding: 12px 16px;
        border: 1px solid #e5e7eb;
      }

      .item-name {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 6px;
      }

      .item-stats {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .stat {
        font-size: 12px;
        color: #6b7280;
        background: #ffffff;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
      }

      .message-timestamp {
        font-size: 11px;
        color: #94a3b8;
        margin-top: 6px;
        text-align: left;
      }

      .user-message .message-timestamp {
        text-align: right;
      }

      @media (max-width: 768px) {
        .message {
          gap: 8px;
          margin-bottom: 16px;
        }

        .message-avatar {
          width: 28px;
          height: 28px;
          font-size: 12px;
        }

        .message-bubble {
          padding: 12px 16px;
        }

        .message-text {
          font-size: 14px;
        }

        .item-stats {
          gap: 8px;
        }

        .stat {
          font-size: 11px;
          padding: 3px 6px;
        }
      }
    `,
  ],
})
export class MessageComponent {
  @Input() message!: ChatMessage;

  formatMessage(text: string): string {
    // Convert markdown-like formatting to HTML
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/🍽️/g, '<span style="font-size: 1.2em;">🍽️</span>')
      .replace(/📊/g, '<span style="font-size: 1.2em;">📊</span>')
      .replace(/💡/g, '<span style="font-size: 1.2em;">💡</span>')
      .replace(/📈/g, '<span style="font-size: 1.2em;">📈</span>');

    return formatted;
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getChartType(responseType?: string): string {
    switch (responseType) {
      case 'food_analysis':
        return 'doughnut';
      case 'chart_data':
        return 'bar';
      default:
        return 'doughnut';
    }
  }
}
