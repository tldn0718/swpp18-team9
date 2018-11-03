import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { GraphComponent, GraphService } from './graph';
import { SidebarComponent } from './sidebar';

@NgModule({
  declarations: [GraphComponent, MainComponent, SidebarComponent],
  providers: [
    GraphService
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
})
export class MainModule { }
