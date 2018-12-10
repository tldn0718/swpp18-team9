import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { GraphComponent, GraphService } from './graph';
import { SidebarComponent } from './sidebar';
import { SearchComponent, SearchService } from './search';
import { NotificationComponent } from './notification/notification.component';
import { SettingsComponent, SettingsService } from './settings';
import { MenuComponent } from './menu/menu.component';
import { InfoWindowComponent } from './info-window/info-window.component';

@NgModule({
  declarations: [
    GraphComponent, 
    MainComponent, 
    SidebarComponent, 
    SearchComponent, 
    NotificationComponent, 
    SettingsComponent, 
    MenuComponent, 
    InfoWindowComponent
  ],
  providers: [
    GraphService,
    SearchService,
    SettingsService
  ],
  imports: [
    CommonModule,
    CoreModule,
    MainRoutingModule
  ],
})
export class MainModule { }
