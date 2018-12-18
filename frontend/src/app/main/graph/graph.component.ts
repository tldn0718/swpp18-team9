import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
  level: number = 1;

  constructor(private graph: GraphService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.graph.initializeNetwork(this.container.nativeElement).subscribe(() => {
      this.setNodeHandler();
    });
  }

  setNodeHandler() {
    this.graph.getClickedNodes().subscribe((nodes: any[])=>{
      this.selectedProfiles = this.graph.getUsers(nodes);
    });
  }

  cancelSelected() {
    this.selectedProfiles = [];
    this.graph.unselectAll();
  }

  showAll() {
    this.mode = 'all';
    this.graph.makeAllNetwork().subscribe();
  }

  showLevel() {
    this.mode = 'level';
    this.graph.makeLevelNetwork(this.level).subscribe();
  }

  changeLevel(direction: boolean) {
    if(direction && this.level < 5) {
      this.level++;
    } else if(!direction && this.level > 1) {
      this.level--;
    }
    this.graph.makeLevelNetwork(this.level).subscribe((res)=>{
      console.log('make level network res', res);
    });
  }

}
