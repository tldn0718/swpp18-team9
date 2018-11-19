import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { MainComponent } from './main.component';
import { RouterLinkDirectiveStub } from 'src/testing/router-link-directive-stub';

import {
  SidebarStubComponent, 
  GraphStubComponent, 
  InfoWindowStubComponent, 
  RouterOutletStubComponent
} from '../../testing/stub-component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MainComponent, 
        SidebarStubComponent, 
        GraphStubComponent,
        InfoWindowStubComponent,
        RouterLinkDirectiveStub,
        RouterOutletStubComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
