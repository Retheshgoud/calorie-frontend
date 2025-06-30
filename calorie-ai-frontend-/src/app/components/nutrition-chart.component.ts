import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-nutrition-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-header">
        <h4 class="chart-title">Nutrition Breakdown</h4>
        <div class="total-calories">
          <span class="calories-number">{{ nutritionData.calories }}</span>
          <span class="calories-label">calories</span>
        </div>
      </div>

      <div class="chart-wrapper">
        <canvas #chartCanvas></canvas>
      </div>

      <div class="nutrition-stats">
        <div class="stat-item protein">
          <div class="stat-color"></div>
          <div class="stat-info">
            <span class="stat-value">{{ nutritionData.protein }}g</span>
            <span class="stat-label">Protein</span>
          </div>
          <div class="stat-percentage">{{ getPercentage('protein') }}%</div>
        </div>

        <div class="stat-item carbs">
          <div class="stat-color"></div>
          <div class="stat-info">
            <span class="stat-value">{{ nutritionData.carbs }}g</span>
            <span class="stat-label">Carbs</span>
          </div>
          <div class="stat-percentage">{{ getPercentage('carbs') }}%</div>
        </div>

        <div class="stat-item fat">
          <div class="stat-color"></div>
          <div class="stat-info">
            <span class="stat-value">{{ nutritionData.fat }}g</span>
            <span class="stat-label">Fat</span>
          </div>
          <div class="stat-percentage">{{ getPercentage('fat') }}%</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-container {
        background: #f8fafc;
        border-radius: 16px;
        padding: 20px;
        border: 1px solid #e5e7eb;
        margin-top: 16px;
      }

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .chart-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .total-calories {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .calories-number {
        font-size: 24px;
        font-weight: 700;
        color: #3b82f6;
        line-height: 1;
      }

      .calories-label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
      }

      .chart-wrapper {
        position: relative;
        height: 200px;
        margin-bottom: 20px;
      }

      .chart-wrapper canvas {
        max-height: 200px;
      }

      .nutrition-stats {
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }

      .stat-item {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #ffffff;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }

      .stat-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .protein .stat-color {
        background: #ef4444;
      }

      .carbs .stat-color {
        background: #3b82f6;
      }

      .fat .stat-color {
        background: #f59e0b;
      }

      .stat-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .stat-value {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 11px;
        color: #6b7280;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      .stat-percentage {
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
      }

      @media (max-width: 768px) {
        .chart-container {
          padding: 16px;
        }

        .chart-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .total-calories {
          align-items: flex-start;
        }

        .nutrition-stats {
          flex-direction: column;
          gap: 8px;
        }

        .stat-item {
          padding: 10px 12px;
        }

        .chart-wrapper {
          height: 180px;
          margin-bottom: 16px;
        }
      }

      @media (max-width: 480px) {
        .calories-number {
          font-size: 20px;
        }

        .chart-title {
          font-size: 14px;
        }
      }
    `,
  ],
})
export class NutritionChartComponent implements OnInit, AfterViewInit {
  @Input() nutritionData!: any;
  @Input() chartType: string = 'doughnut';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [
        {
          data: [
            this.nutritionData.protein * 4, // 4 calories per gram of protein
            this.nutritionData.carbs * 4, // 4 calories per gram of carbs
            this.nutritionData.fat * 9, // 9 calories per gram of fat
          ],
          backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b'],
          borderWidth: 0,
          cutout: '70%',
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                ) as number;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} cal (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          //animateRotate: true,
          duration: 1000,
          easing: 'easeOutCubic',
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  getPercentage(macroType: string): number {
    let calories = 0;
    switch (macroType) {
      case 'protein':
        calories = this.nutritionData.protein * 4;
        break;
      case 'carbs':
        calories = this.nutritionData.carbs * 4;
        break;
      case 'fat':
        calories = this.nutritionData.fat * 9;
        break;
    }

    const totalCalories =
      this.nutritionData.protein * 4 +
      this.nutritionData.carbs * 4 +
      this.nutritionData.fat * 9;

    return Math.round((calories / totalCalories) * 100);
  }
}
