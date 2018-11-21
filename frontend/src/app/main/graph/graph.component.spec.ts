import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { GraphComponent } from './graph.component';
import { InfoWindowComponent } from '../info-window/info-window.component';
import { GraphService } from './graph.service';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  let graphServiceMethods = [
    'initializeNetwork', 
    'getClickedNodes', 
    'getUsers',
    'unselectAll',
    'makeAllNetwork',
    'getLevel',
    'makeLevelNetwork'
  ];
  let graphService = jasmine.createSpyObj('GraphService', graphServiceMethods);

  graphService.initializeNetwork.and.returnValue(of(null));
  graphService.getClickedNodes.and.returnValue(of([]));
  graphService.getUsers.and.returnValue();
  graphService.unselectAll.and.returnValue();
  graphService.makeAllNetwork.and.returnValue(of(null));
  graphService.makeLevelNetwork.and.returnValue(of(null));
  graphService.getLevel.and.returnValue(of(null));

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

  it('#cancelSelected should empty selectedProfiles', ()=>{
    component.cancelSelected();
    expect(component.selectedProfiles).toEqual([]);
  });

  it('#showAll should set mode to all', ()=>{
    component.showAll();
    expect(component.mode).toBe('all');
  });

  it('#showLevel should set mode to level', ()=>{
    component.showLevel();
    expect(component.mode).toBe('level');
  });

  it('#changeLevel(true) should increase level by 1', ()=>{
    component.level = 1;
    component.changeLevel(true);
    expect(component.level).toBe(2);
  });

  it('#changeLevel(true) when level is already 5 should not do anything', ()=>{
    component.level = 5;
    component.changeLevel(true);
    expect(component.level).toBe(5);
  });

  it('#changeLevel(false) should increase level by 1', ()=>{
    component.level = 2;
    component.changeLevel(false);
    expect(component.level).toBe(1);
  });

  it('#changeLevel(false) when level is already 1 should not do anything', ()=>{
    component.level = 1;
    component.changeLevel(false);
    expect(component.level).toBe(1);
  });
});
