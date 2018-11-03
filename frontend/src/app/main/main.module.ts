import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph/graph.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [GraphComponent, MainComponent, SidebarComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
})
export class MainModule { }
