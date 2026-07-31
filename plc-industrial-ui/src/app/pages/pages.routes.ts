import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '@/app/core/auth/auth.guard';

export default [
  { path: '', component: DashboardComponent },

  {
    path: 'measurements',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./measurements-history/measurements.component').then(
        m => m.MeasurementsComponent
      )
  },
  {
    path: 'temperature-history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./temperature-history/temperature-history.component').then(
        m => m.TemperatureHistoryComponent
      )
  },

  { path: '**', redirectTo: '/notfound' }
] as Routes;