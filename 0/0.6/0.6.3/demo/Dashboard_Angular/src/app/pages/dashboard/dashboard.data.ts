import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions } from 'ng-apexcharts';

export interface WidgetSummary {
  title: string;
  total: number;
  percent: number;
  icon: string;
  color?: 'primary' | 'secondary' | 'warning' | 'error';
  categories: string[];
  series: number[];
}

export interface WebsiteVisitsChart {
  title: string;
  subheader: string;
  categories: string[];
  series: ApexAxisChartSeries;
  options?: ApexOptions;
}

export interface CurrentVisitsChart {
  title: string;
  series: ApexNonAxisChartSeries;
  labels: string[];
  options?: ApexOptions;
}

export const DASHBOARD_WIDGETS: WidgetSummary[] = [
  {
    title: 'Ventas semanales',
    total: 714000,
    percent: 2.6,
    icon: '🛍️',
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    series: [22, 8, 35, 50, 82, 84, 77, 12]
  },
  {
    title: 'Nuevos usuarios',
    total: 1352831,
    percent: -0.1,
    icon: '👥',
    color: 'secondary',
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    series: [56, 47, 40, 62, 73, 30, 23, 54]
  },
  {
    title: 'Órdenes de compra',
    total: 1723315,
    percent: 2.8,
    icon: '🧾',
    color: 'warning',
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    series: [40, 70, 50, 28, 70, 75, 7, 64]
  },
  {
    title: 'Mensajes',
    total: 234,
    percent: 3.6,
    icon: '💬',
    color: 'error',
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    series: [56, 30, 23, 54, 47, 40, 62, 73]
  }
];

export const WEBSITE_VISITS: WebsiteVisitsChart = {
  title: 'Visitas al sitio web',
  subheader: '(+43%) que el año pasado',
  categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
  series: [
    { name: 'Equipo A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
    { name: 'Equipo B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] }
  ]
};

export const CURRENT_VISITS: CurrentVisitsChart = {
  title: 'Visitas actuales',
  labels: ['América', 'Asia', 'Europa', 'África'],
  series: [3500, 2500, 1500, 500]
};
