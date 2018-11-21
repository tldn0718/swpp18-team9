import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { InfoWindowComponent } from './info-window.component';

describe('InfoWindowComponent', () => {
  let component: InfoWindowComponent;
  let fixture: ComponentFixture<InfoWindowComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should not do anything', ()=>{
    component.ngOnInit();
    expect().nothing()
  });

  it('#confirmProfiles should set confirmed to true', ()=>{
    component.confirmProfiles();
    expect(component.confirmed).toBeTruthy();
  });

  it('#cancelProfiles should make cancelSelected emit void', ()=>{
    component.cancelSelected.subscribe((res)=>{
      expect(res).toBeFalsy();
    });
    component.cancelProfiles();
  });

});
