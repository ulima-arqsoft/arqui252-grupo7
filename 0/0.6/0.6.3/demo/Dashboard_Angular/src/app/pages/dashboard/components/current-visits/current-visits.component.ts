import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTooltip } from 'ng-apexcharts';

import { CurrentVisitsChart } from '../../dashboard.data';

export type CurrentVisitsChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-current-visits',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './current-visits.component.html',
  styleUrls: ['./current-visits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentVisitsComponent {
  @Input({ required: true }) data!: CurrentVisitsChart;

  get chartOptions(): CurrentVisitsChartOptions {
    return {
      series: this.data.series,
      chart: {
        type: 'donut',
        height: 360
      },
      labels: this.data.labels,
      stroke: {
        width: 2,
        colors: ['#ffffff']
      },
      tooltip: {
        fillSeriesColor: false,
        y: {
          formatter: (value?: number) => (typeof value === 'number' ? new Intl.NumberFormat('es-ES').format(value) : '')
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Visitas',
                formatter: () =>
                  new Intl.NumberFormat('es-ES').format(
                    this.data.series.reduce((acc, value) => acc + (typeof value === 'number' ? value : 0), 0)
                  )
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: { height: 320 },
            legend: { position: 'bottom' }
          }
        }
      ]
    };
  }
}
