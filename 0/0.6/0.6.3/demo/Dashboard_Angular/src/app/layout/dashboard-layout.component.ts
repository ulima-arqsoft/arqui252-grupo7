import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

import { NAV_ITEMS } from './nav-data';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor, NgIf],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {
  readonly navItems = NAV_ITEMS;
  readonly toolbarTitle = 'Panel';
  readonly accountName = 'Jaydon Frankie';
  readonly accountAvatarUrl = 'assets/images/avatar/avatar-1.webp';
}
