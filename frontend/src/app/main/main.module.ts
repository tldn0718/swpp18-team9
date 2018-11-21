import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { GraphComponent, GraphService } from './graph';
import { SidebarComponent } from './sidebar';
import { SearchComponent } from './search/search.component';
import { NotificationComponent } from './notification/notification.component';
import { SettingsComponent } from './settings/settings.component';
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
    GraphService
  ],
  imports: [
    CommonModule,
    CoreModule,
    MainRoutingModule
  ],
})
export class MainModule { }
