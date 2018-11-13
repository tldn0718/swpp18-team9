import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Network } from 'vis';
import { GraphService } from './graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {

  @ViewChild('networkContainer') container: ElementRef;

  selectedProfiles: any[] = [];

  mode: 'all' | 'level' = 'all';

  constructor(private graph: GraphService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.graph.initializeNetwork(this.container.nativeElement).subscribe(() => {
      this.setNodeHandler();
    });
  }

  setNodeHandler() {
    this.graph.getClikedNodes().subscribe((nodes: any[])=>{
      this.selectedProfiles = [...nodes];
    });
  }

  cancelSelected() {
    this.selectedProfiles = [];
    this.graph.unselectAll();
  }

  showAll() {
    this.mode = 'all';
  }

  showLevel() {
    this.mode = 'level';
  }

}
