import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
  { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
  { path: 'notfound', component: Notfound },
  {
    path: '',
    component: AppLayout,
    loadChildren: () => import('./app/pages/pages.routes')
  },
  { path: '**', redirectTo: '/notfound' }
];
