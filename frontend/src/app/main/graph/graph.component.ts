import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Network } from 'vis';
import { DataSet, Node, Edge } from 'vis';

export const mockNodes: DataSet<Node> = new DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
]);

export const mockEdges: DataSet<Edge> = new DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

export const mockData = {
    nodes: mockNodes,
    edges: mockEdges
};


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {

  @ViewChild('networkContainer') container: ElementRef;

  network: Network;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.network = new Network(this.container.nativeElement, mockData, {});
  }

}
