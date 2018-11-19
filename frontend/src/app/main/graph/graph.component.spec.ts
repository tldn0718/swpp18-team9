import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { GraphComponent } from './graph.component';
import { InfoWindowComponent } from '../info-window/info-window.component';
import { GraphService } from './graph.service';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  let graphServiceMethods = ['initializeNetwork', 'getClickedNodes', 'getUsers'];
  let graphService = jasmine.createSpyObj('GraphService', graphServiceMethods);

  graphService.initializeNetwork.and.returnValue(of(null));
  graphService.getClickedNodes.and.returnValue(of([]));
  graphService.getUsers.and.returnValue()

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphComponent, InfoWindowComponent ],
      providers: [{provide: GraphService, useValue: graphService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
