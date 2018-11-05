import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '../auth/auth.guard';
import { MenuComponent } from './menu';
import { SearchComponent } from './search/search.component';
import { NotificationComponent } from './notification/notification.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { 
    path: 'main', 
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: MenuComponent, outlet: 'sidebar' },
      { path: 'search', component: SearchComponent, outlet: 'sidebar' },
      { path: 'notification', component: NotificationComponent, outlet: 'sidebar' },
      { path: 'settings', component: SettingsComponent, outlet: 'sidebar' },
    ]
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule { }
