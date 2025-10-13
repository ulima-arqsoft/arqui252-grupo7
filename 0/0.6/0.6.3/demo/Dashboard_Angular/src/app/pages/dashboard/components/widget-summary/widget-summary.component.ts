import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexStroke,
  ApexTooltip,
  ApexXAxis
} from 'ng-apexcharts';

import { WidgetSummary } from '../../dashboard.data';

export type WidgetSummaryChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  markers: ApexMarkers;
  fill: ApexFill;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'app-widget-summary',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './widget-summary.component.html',
  styleUrls: ['./widget-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetSummaryComponent {
  private readonly baseColorMap: Record<string, string> = {
    primary: '#2065D1',
    secondary: '#3366FF',
    warning: '#FFAB00',
    error: '#FF5630'
  };

  @Input({ required: true }) summary!: WidgetSummary;

  get chartOptions(): WidgetSummaryChartOptions {
    const color = this.resolveColor(this.summary.color);

    return {
      series: [
        {
          name: this.summary.title,
          data: this.summary.series
        }
      ],
      chart: {
        type: 'line',
        height: 120,
        sparkline: { enabled: true }
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.4,
          opacityFrom: 0.36,
          opacityTo: 0.12,
          stops: [0, 80, 100],
          colorStops: []
        }
      },
      markers: {
        size: 0
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: this.summary.categories
      },
      tooltip: {
        y: {
          formatter: (value?: number) => (typeof value === 'number' ? new Intl.NumberFormat('es-ES').format(value) : '')
        }
      },
      colors: [color]
    };
  }

  iconBackground(summary: WidgetSummary): string {
    const color = this.resolveColor(summary.color);
    return `linear-gradient(135deg, ${this.withAlpha(color, 0.24)} 0%, ${this.withAlpha(color, 0.08)} 100%)`;
  }

  iconColor(summary: WidgetSummary): string {
    return this.resolveColor(summary.color);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  }

  formatPercent(value: number): string {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  private resolveColor(color: WidgetSummary['color']): string {
    return this.baseColorMap[color ?? 'primary'];
  }

  private withAlpha(hexColor: string, alpha: number): string {
    const normalizedAlpha = Math.max(0, Math.min(1, alpha));
    const alphaHex = Math.round(normalizedAlpha * 255)
      .toString(16)
      .padStart(2, '0');
    return `${hexColor}${alphaHex}`;
  }
}
