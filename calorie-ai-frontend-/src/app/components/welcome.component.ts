import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="welcome-container">
      <div class="welcome-card">
        <div class="welcome-header">
          <div class="app-icon">🥗</div>
          <h1 class="app-title">CalorieHive (beta)</h1>
          <p class="app-subtitle">Your AI Nutrition Companion</p>
        </div>
        
        <div class="welcome-form">
          <div class="input-group">
            <label for="name">What's your name?</label>
            <input 
              id="name"
              type="text" 
              [(ngModel)]="name" 
              (keyup.enter)="submitName()"
              placeholder="Enter your name"
              class="name-input"
              maxlength="30">
          </div>
          
          <button 
            (click)="submitName()" 
            [disabled]="!name.trim()"
            class="continue-btn">
            <span>Continue</span>
            <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="welcome-features">
          <div class="feature">
            <span class="feature-icon">📊</span>
            <span class="feature-text">Nutrition Analysis</span>
          </div>
          <div class="feature">
            <span class="feature-icon">💡</span>
            <span class="feature-text">Smart Recommendations</span>
          </div>
          <div class="feature">
            <span class="feature-icon">📈</span>
            <span class="feature-text">Progress Tracking</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .welcome-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 48px 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .welcome-header {
      margin-bottom: 40px;
    }

    .app-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .app-title {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .app-subtitle {
      font-size: 16px;
      color: #64748b;
      font-weight: 500;
    }

    .welcome-form {
      margin-bottom: 40px;
    }

    .input-group {
      margin-bottom: 24px;
      text-align: left;
    }

    .input-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .name-input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 500;
      background: #ffffff;
      transition: all 0.2s ease;
      outline: none;
    }

    .name-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .continue-btn {
      width: 100%;
      padding: 16px 24px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .continue-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .continue-btn:active {
      transform: translateY(0);
    }

    .continue-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .arrow-icon {
      transition: transform 0.2s ease;
    }

    .continue-btn:hover:not(:disabled) .arrow-icon {
      transform: translateX(2px);
    }

    .welcome-features {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .feature-icon {
      font-size: 24px;
    }

    .feature-text {
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      text-align: center;
      line-height: 1.3;
    }

    @media (max-width: 480px) {
      .welcome-card {
        padding: 32px 24px;
        margin: 16px;
      }
      
      .app-title {
        font-size: 28px;
      }
      
      .welcome-features {
        flex-direction: column;
        gap: 12px;
      }
      
      .feature {
        flex-direction: row;
        justify-content: center;
      }
    }
  `]
})
export class WelcomeComponent {
  @Output() nameSubmitted = new EventEmitter<string>();
  name: string = '';

  submitName() {
    if (this.name.trim()) {
      this.nameSubmitted.emit(this.name.trim());
    }
  }
}