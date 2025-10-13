import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

import { WebsiteVisitsChart } from '../../dashboard.data';

export type WebsiteVisitsChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
};

@Component({
  selector: 'app-website-visits',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './website-visits.component.html',
  styleUrls: ['./website-visits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebsiteVisitsComponent {
  @Input({ required: true }) data!: WebsiteVisitsChart;

  get chartOptions(): WebsiteVisitsChartOptions {
    return {
      series: this.data.series,
      chart: {
        type: 'area',
        height: 360,
        toolbar: { show: false }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: this.data.categories
      },
      yaxis: {
        labels: {
          formatter: (value: number) => new Intl.NumberFormat('es-ES').format(Math.round(value))
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value?: number) => (typeof value === 'number' ? new Intl.NumberFormat('es-ES').format(value) : '')
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      grid: {
        strokeDashArray: 4
      }
    };
  }
}
