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
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { WritePostComponent } from './write-post/write-post.component';
import { PostComponent } from './post/post.component';
import { GroupComponent } from './group/group.component';
import { MakeGroupComponent } from './make-group/make-group.component';

@NgModule({
  declarations: [
    GraphComponent, 
    MainComponent, 
    SidebarComponent, 
    SearchComponent, 
    NotificationComponent, 
    SettingsComponent, 
    MenuComponent, 
    InfoWindowComponent, 
    ProfileComponent, 
    WritePostComponent, 
    PostComponent, GroupComponent, MakeGroupComponent
  ],
  entryComponents: [
    ProfileComponent,
    WritePostComponent,
    MakeGroupComponent,
  ],
  providers: [
    GraphService,
    SearchService,
    SettingsService,
    ProfileService,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MainRoutingModule
  ],
})
export class MainModule { }
