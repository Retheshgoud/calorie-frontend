import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat.component';
import { WelcomeComponent } from './components/welcome.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent, WelcomeComponent],
  template: `
    <div class="app-container">
      <div class="app-content" [class.welcome-mode]="!userName">
        <app-welcome 
          *ngIf="!userName" 
          (nameSubmitted)="onNameSubmitted($event)">
        </app-welcome>
        
        <app-chat 
          *ngIf="userName" 
          [userName]="userName">
        </app-chat>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      width: 100vw;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .app-content {
      height: 100%;
      width: 100%;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .welcome-mode {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `]
})
export class AppComponent implements OnInit {
  userName: string = '';

  ngOnInit() {
    this.userName = localStorage.getItem('nutribot_username') || '';
  }

  onNameSubmitted(name: string) {
    this.userName = name;
    localStorage.setItem('nutribot_username', name);
  }
}