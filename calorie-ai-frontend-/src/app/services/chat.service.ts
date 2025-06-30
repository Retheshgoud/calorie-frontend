import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  responseType?: string;
  nutritionData?: any;
}

export interface ChatResponse {
  response: string;
  responseType: string;
  timestamp: string;
  userName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API_BASE_URL = 'https://calorie-api-ybzv.onrender.com'; // Update this to your backend URL

  constructor(private http: HttpClient) {}

  sendMessage(message: string, userName: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.API_BASE_URL}/api/chat`, {
      message,
      userName
    });
  }

  getNutritionFacts(food: string, quantity?: string): Observable<any> {
    const params = quantity ? { quantity } : {};
    return this.http.get(`${this.API_BASE_URL}/api/nutrition-facts/${food}`, {  });
  }

  getMealSuggestions(goal?: string, cuisine?: string, calories?: string): Observable<any> {
    const params: any = {};
    if (goal) params.goal = goal;
    if (cuisine) params.cuisine = cuisine;
    if (calories) params.calories = calories;
    
    return this.http.get(`${this.API_BASE_URL}/api/meal-suggestions`, { params });
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/health`);
  }

  // Helper method to parse nutrition data from AI response
  parseNutritionData(response: string): any {
    const nutritionRegex = /(\d+)\s*calories?.*?(\d+)g?\s*protein.*?(\d+)g?\s*carbs?.*?(\d+)g?\s*fat/gi;
    const match = nutritionRegex.exec(response);
    
    if (match) {
      return {
        calories: parseInt(match[1]),
        protein: parseInt(match[2]),
        carbs: parseInt(match[3]),
        fat: parseInt(match[4])
      };
    }
    
    return null;
  }

  // Helper method to extract meal items from response
  extractMealItems(response: string): any[] {
    const lines = response.split('\n');
    const items: any[] = [];
    
    lines.forEach(line => {
      const itemMatch = line.match(/[-•]\s*(.+?):\s*(\d+)\s*calories/i);
      if (itemMatch) {
        const nutritionMatch = line.match(/(\d+)\s*calories.*?(\d+)g?\s*protein.*?(\d+)g?\s*carbs.*?(\d+)g?\s*fat/i);
        if (nutritionMatch) {
          items.push({
            name: itemMatch[1].trim(),
            calories: parseInt(nutritionMatch[1]),
            protein: parseInt(nutritionMatch[2]) || 0,
            carbs: parseInt(nutritionMatch[3]) || 0,
            fat: parseInt(nutritionMatch[4]) || 0
          });
        }
      }
    });
    
    return items;
  }

  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
