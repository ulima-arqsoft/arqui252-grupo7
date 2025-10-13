import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';

import { CurrentVisitsComponent } from './components/current-visits/current-visits.component';
import { WebsiteVisitsComponent } from './components/website-visits/website-visits.component';
import { WidgetSummaryComponent } from './components/widget-summary/widget-summary.component';
import { CURRENT_VISITS, DASHBOARD_WIDGETS, WEBSITE_VISITS } from './dashboard.data';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [NgFor, WidgetSummaryComponent, CurrentVisitsComponent, WebsiteVisitsComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  readonly widgetSummaries = DASHBOARD_WIDGETS;
  readonly currentVisits = CURRENT_VISITS;
  readonly websiteVisits = WEBSITE_VISITS;
}
