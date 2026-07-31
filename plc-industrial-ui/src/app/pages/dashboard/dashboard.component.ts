import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { PlcDashboardFacade } from '../service/plc-dashboard.facade';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, CardModule, TagModule, TableModule, TranslatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
    readonly readings;
    readonly temperature;
    readonly pressure;
    readonly level;

  constructor(public dashboardFacade: PlcDashboardFacade) {
    this.readings = dashboardFacade.readings;
    this.temperature = dashboardFacade.temperature;
    this.pressure = dashboardFacade.pressure;
    this.level = dashboardFacade.level;
  }

  ngOnInit(): void {
    this.dashboardFacade.start();
  }

  ngOnDestroy(): void {
    this.dashboardFacade.stop();
  }

  getSeverityFromQuality(quality?: string): 'success' | 'danger' | 'warn' | 'info' | 'secondary' | 'contrast' {
    if (quality === 'GOOD') {
      return 'success';
    }

    if (quality === 'UNCERTAIN') {
      return 'warn';
    }

    return 'danger';
  }

  getQualityLabel(quality?: string): string {
  switch (quality) {
    case 'GOOD':
      return 'dashboard.quality.good';
    case 'UNCERTAIN':
      return 'dashboard.quality.uncertain';
    default:
      return 'dashboard.quality.bad';
  }
}
}