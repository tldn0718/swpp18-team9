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

  network: Network;

  selectedProfiles: any[] = [];

  constructor(private graph: GraphService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.graph.makeMockNetwork(this.container.nativeElement).subscribe((network) => {
      this.network = network;
      this.setNodeHandler(this.network);
    });
  }

  setNodeHandler(network: Network) {
    this.graph.getClikedNodes(network).subscribe((nodes: any[])=>{
      this.selectedProfiles = [...nodes];
    })
  }

  cancelSelected() {
    this.selectedProfiles = [];
    this.network.unselectAll();
  }


}
